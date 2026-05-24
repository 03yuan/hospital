import { Router, Request, Response } from 'express';
import { IMedicineCategoryRepository } from '../domain/repositories/IMedicineCategoryRepository';
import { IMedicineRepository } from '../domain/repositories/IMedicineRepository';

let categoryRepoInstance: IMedicineCategoryRepository;
let medicineRepoInstance: IMedicineRepository;

export function initMedicineRoutes(
  categoryRepo: IMedicineCategoryRepository,
  medicineRepo: IMedicineRepository,
): Router {
  categoryRepoInstance = categoryRepo;
  medicineRepoInstance = medicineRepo;
  return medicineRouter;
}

const medicineRouter = Router();

medicineRouter.get('/medicine-categories', async (_req: Request, res: Response) => {
  try {
    const categories = await categoryRepoInstance.findAll();
    res.json({ code: 0, data: categories.map((c) => ({ id: c.id, name: c.name })), message: 'ok' });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

medicineRouter.get('/medicines', async (req: Request, res: Response) => {
  try {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    let medicines;
    if (categoryId) {
      medicines = await medicineRepoInstance.findByCategoryId(categoryId);
    } else {
      medicines = await medicineRepoInstance.findAll();
    }
    res.json({
      code: 0,
      data: medicines.map((m) => ({
        id: m.id,
        categoryId: m.categoryId,
        name: m.name,
        commonDosage: m.commonDosage,
        commonMethod: m.commonMethod,
      })),
      message: 'ok',
    });
  } catch (err: any) {
    res.status(500).json({ code: 50001, data: null, message: err.message });
  }
});

export { medicineRouter };
