import fs from 'fs';
import path from 'path';

// Generate a random ID without external dependencies
function generateId(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Define the Slide interface
export interface Slide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string | null;
  buttonLink?: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Path to the slides JSON file
const slidesFilePath = path.join(process.cwd(), 'data', 'slides.json');

// Function to read slides from the JSON file
export function getSlides(): Slide[] {
  try {
    if (!fs.existsSync(slidesFilePath)) {
      return [];
    }
    
    const data = fs.readFileSync(slidesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading slides:', error);
    return [];
  }
}

// Function to get a single slide by ID
export function getSlideById(id: string): Slide | null {
  const slides = getSlides();
  return slides.find(slide => slide.id === id) || null;
}

// Function to save slides to the JSON file
export function saveSlides(slides: Slide[]): void {
  try {
    // Ensure the directory exists
    const dir = path.dirname(slidesFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(slidesFilePath, JSON.stringify(slides, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving slides:', error);
    throw error;
  }
}

// Function to create a new slide
export function createSlide(slideData: Omit<Slide, 'id' | 'createdAt' | 'updatedAt'>): Slide {
  const slides = getSlides();
  
  const newSlide: Slide = {
    ...slideData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  slides.push(newSlide);
  saveSlides(slides);
  
  return newSlide;
}

// Function to update a slide
export function updateSlide(id: string, slideData: Partial<Omit<Slide, 'id' | 'createdAt'>>): Slide | null {
  const slides = getSlides();
  const slideIndex = slides.findIndex(slide => slide.id === id);
  
  if (slideIndex === -1) {
    return null;
  }
  
  const updatedSlide: Slide = {
    ...slides[slideIndex],
    ...slideData,
    updatedAt: new Date().toISOString(),
  };
  
  slides[slideIndex] = updatedSlide;
  saveSlides(slides);
  
  return updatedSlide;
}

// Function to delete a slide
export function deleteSlide(id: string): boolean {
  const slides = getSlides();
  const filteredSlides = slides.filter(slide => slide.id !== id);
  
  if (filteredSlides.length === slides.length) {
    return false;
  }
  
  saveSlides(filteredSlides);
  return true;
}
