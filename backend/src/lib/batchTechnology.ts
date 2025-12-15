import { PrismaClient } from '@prisma/client';

/**
 * Optimización N+1: Procesa tecnologías en batch en lugar de serial
 * Reducción: 30+ queries → 3-5 queries
 */
export async function batchProcessTechnologies(
    prisma: PrismaClient | any, // any para soportar transacción
    projectId: string,
    technologiesData: Array<{
        name: string;
        category?: string;
        proficiency?: number;
        yearsOfExperience?: number;
    }>
): Promise<void> {
    if (!technologiesData || technologiesData.length === 0) return;

    // Paso 1: Batch fetch de tecnologías existentes (1 query)
    const techNames = technologiesData.map((t) => t.name);
    const existingTechs = await prisma.technology.findMany({
        where: { name: { in: techNames } },
    });

    const techMap = new Map(existingTechs.map((t: any) => [t.name, t]));
    const techsToCreate: any[] = [];
    const techsToUpdate: any[] = [];

    // Paso 2: Clasificar en memoria (0 queries)
    for (const techData of technologiesData) {
        const { name, category, proficiency, yearsOfExperience } = techData;
        const existing = techMap.get(name);

        if (!existing) {
            techsToCreate.push({
                name,
                category: category || 'other',
                proficiency: proficiency !== undefined ? proficiency : 50,
                yearsOfExperience: yearsOfExperience !== undefined ? yearsOfExperience : 0,
                color: '#FF0000',
            });
        } else {
            const shouldUpdate =
                (proficiency !== undefined && proficiency > existing.proficiency) ||
                (yearsOfExperience !== undefined && yearsOfExperience > existing.yearsOfExperience);

            if (shouldUpdate) {
                techsToUpdate.push({
                    id: existing.id,
                    proficiency:
                        proficiency !== undefined && proficiency > existing.proficiency
                            ? proficiency
                            : existing.proficiency,
                    yearsOfExperience:
                        yearsOfExperience !== undefined && yearsOfExperience > existing.yearsOfExperience
                            ? yearsOfExperience
                            : existing.yearsOfExperience,
                });
            }
        }
    }

    // Paso 3: Batch operations (3-5 queries)
    // Crear nuevas tecnologías
    if (techsToCreate.length > 0) {
        await prisma.technology.createMany({
            data: techsToCreate,
            skipDuplicates: true,
        });
    }

    // Actualizar existentes (individual porque updateMany no soporta valores distintos por row)
    for (const tech of techsToUpdate) {
        await prisma.technology.update({
            where: { id: tech.id },
            data: {
                proficiency: tech.proficiency,
                yearsOfExperience: tech.yearsOfExperience,
            },
        });
    }

    // Re-fetch para obtener IDs completos
    const allTechs = await prisma.technology.findMany({
        where: { name: { in: techNames } },
    });

    const techIdMap = new Map(allTechs.map((t: any) => [t.name, t.id]));

    // Crear relaciones en batch
    const projectTechData: any[] = [];
    for (const techData of technologiesData) {
        const technologyId = techIdMap.get(techData.name);
        if (technologyId) {
            projectTechData.push({
                projectId,
                technologyId,
                category: techData.category || 'other',
                proficiency: techData.proficiency !== undefined ? techData.proficiency : 50,
                yearsOfExperience: techData.yearsOfExperience !== undefined ? techData.yearsOfExperience : 0,
            });
        }
    }

    if (projectTechData.length > 0) {
        await prisma.projectTechnology.createMany({
            data: projectTechData,
        });
    }
}
