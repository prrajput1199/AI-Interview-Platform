import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";
import { InterviewService } from "../modules/interview/interview.service";

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
    adapter,
});


async function testInterview() {
  
  try {
    // First, create a test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        FirebaseUid: 'test123'
      }
    });
``
    // Add credits to the user
    await prisma.creditwallet.create({
      data: {
        userId: user.id,
        balance: 10
      }
    });

    const interviewService = new InterviewService();
    
    // Create an interview
    const interview = await interviewService.createInterview(
      user.id,
      'FRONTEND',
      'Test Frontend Interview'
    );
    console.log('Created interview:', interview);

    // Generate questions
    const questions = await interviewService.generateQuestions(interview.id);
    console.log('Generated questions:', questions);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testInterview();