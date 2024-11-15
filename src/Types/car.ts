export interface Car {
    id: number;
    title: string;
    description: string;
    images: string[];
    tags: { [key: string]: string };
    userId: number;
    createdAt: string;
    updatedAt: string;
}
  