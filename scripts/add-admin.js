import { PrismaClient } from "@prisma/client"
import inquirer from "inquirer"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const questions = [
    {
      type: "input",
      name: "email",
      message: "Enter admin email:",
      validate: (value) => {
        if (value.includes("@")) return true
        return "Please enter a valid email address"
      },
    },
    {
      type: "password",
      name: "password",
      message: "Enter admin password:",
      validate: (value) => {
        if (value.length >= 8) return true
        return "Password must be at least 8 characters long"
      },
    },
    {
      type: "input",
      name: "name",
      message: "Enter admin name:",
    },
  ]

  try {
    const answers = await inquirer.prompt(questions)
    const hashedPassword = await bcrypt.hash(answers.password, 10)

    const user = await prisma.user.create({
      data: {
        email: answers.email,
        name: answers.name,
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    console.log(`Admin user created successfully: ${user.email}`)
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()