import { connectDB } from "../lib/db";
import { Note } from "../models/Note";
import { SAMPLE_NOTES } from "./data";

export async function seedNotes() {
  await connectDB();
  console.log("Connected to MongoDB for seeding...");

  for (const item of SAMPLE_NOTES) {
    const existing = await Note.findOne({ slug: item.slug });
    if (!existing) {
      await Note.create({
        title: item.title,
        slug: item.slug,
        description: item.description,
        subject: item.subject,
        category: item.category,
        yearTag: item.yearTag,
        price: item.price * 100, // store in paise
        mrp: item.mrp * 100,
        samplePages: 3,
        sampleImages: item.sampleImages,
        whatsInside: item.whatsInside,
        rating: item.rating,
        ratingCount: item.ratingCount,
        studentsBought: item.studentsBought,
        featured: !!item.featured,
        published: true,
        color: item.color,
      });
      console.log(`✓ Seeded note: ${item.title}`);
    }
  }

  console.log("All sample notes ensured in MongoDB!");
}

