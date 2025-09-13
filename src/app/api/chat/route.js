import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY);
export async function POST(request) {
  let conversationHistory = [];
  let userMessages = 0;
  let lastUserMessage = '';

  try {
    const body = await request.json();
    const { message, conversationHistory: convHistory } = body;
    conversationHistory = convHistory || [];
    userMessages = conversationHistory.filter(msg => msg.type === 'user').length;
    lastUserMessage = conversationHistory.filter(msg => msg.type === 'user').pop()?.content || message;
    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: 'Message field is required and must be a string' },
        { status: 400 }
      );
    }
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.3,
      }
    });
    userMessages = conversationHistory.filter(msg => msg.type === 'user').length;
    const conversationText = conversationHistory.map(msg => msg.content).join(' ').toLowerCase();
    let prompt;
    let shouldGenerateRoadmap = false;
    const hasEducationInfo = conversationText.includes('stud') || conversationText.includes('degree') ||
                           conversationText.includes('school') || conversationText.includes('college') ||
                           conversationText.includes('university') || conversationText.includes('education') ||
                           conversationText.includes('high school') || conversationText.includes('grade');
    const hasExperienceInfo = conversationText.includes('experience') || conversationText.includes('work') ||
                            conversationText.includes('job') || conversationText.includes('intern') ||
                            conversationText.includes('volunteer') || conversationText.includes('background') ||
                            conversationText.includes('skill') || conversationText.includes('knowledge');
    const hasGoalsInfo = conversationText.includes('goal') || conversationText.includes('want') ||
                        conversationText.includes('plan') || conversationText.includes('future') ||
                        conversationText.includes('timeline') || conversationText.includes('motivation') ||
                        conversationText.includes('why') || conversationText.includes('interest');
    const hasSkillsInfo = conversationText.includes('programming') || conversationText.includes('language') ||
                         conversationText.includes('certificat') || conversationText.includes('course') ||
                         conversationText.includes('training') || conversationText.includes('expertise') ||
                         conversationText.includes('computer') || conversationText.includes('tech');
    const informationScore = [hasEducationInfo, hasExperienceInfo, hasGoalsInfo, hasSkillsInfo].filter(Boolean).length;
    if (informationScore >= 3 && userMessages >= 5 && conversationText.length > 100) {
      shouldGenerateRoadmap = true;
    }
    if (userMessages === 1) {
      prompt = `User wants: "${message}". Ask about their current education level. Keep under 15 words.`;
    } else if (userMessages === 2) {
      prompt = `User said: "${message}". Ask about their relevant skills or experience. Keep under 15 words.`;
    } else if (userMessages === 3) {
      prompt = `User said: "${message}". Ask about their career goals and timeline. Keep under 15 words.`;
    } else if (userMessages === 4) {
      prompt = `User said: "${message}". Ask about their interests in this field. Keep under 15 words.`;
    } else if (userMessages === 5 && !shouldGenerateRoadmap) {
      prompt = `User said: "${message}". Ask one more question to complete information. Keep under 15 words.`;
    } else if (shouldGenerateRoadmap) {
      const context = conversationHistory.map(msg => `${msg.type === 'user' ? 'U' : 'A'}: ${msg.content}`).join('\n');
      prompt = `Create custom roadmap for: "${conversationHistory[0].content}"
Conversation:
${context}
Return ONLY valid JSON:
{
  "career": "Career Title",
  "summary": "Brief summary",
  "steps": [
    {
      "title": "Step Title",
      "description": "Brief description",
      "timeline": "Time frame",
      "resources": ["Resource1", "Resource2"],
      "challenges": ["Challenge1"],
      "milestones": ["Milestone1"]
    }
  ],
  "salary": "Salary range",
  "jobMarket": "Market outlook"
}`;
    } else {
      prompt = `User said: "${message}". Ask 1 brief question. Keep under 15 words.`;
    }
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiMessage = response.text().trim();
    let roadmapData = null;
    let finalMessage = aiMessage;
    if (shouldGenerateRoadmap) {
      try {
        let jsonText = aiMessage.trim();
        if (jsonText.includes('```')) {
          jsonText = jsonText.replace(/```json?\n?/g, '').trim();
        }
        const start = jsonText.indexOf('{');
        const end = jsonText.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          jsonText = jsonText.substring(start, end + 1);
        }
        roadmapData = JSON.parse(jsonText);
        finalMessage = "Your custom roadmap is ready! Click the button above.";
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.log('Using fallback engineer template due to JSON parsing failure');
        roadmapData = {
          "career": "Software Engineer",
          "summary": "A comprehensive career path for becoming a skilled software engineer, focusing on practical skills, continuous learning, and professional growth.",
          "steps": [
            {
              "title": "Master Programming Fundamentals",
              "description": "Learn core programming concepts using Python or JavaScript. Focus on data structures, algorithms, and problem-solving skills.",
              "timeline": "3-6 months",
              "resources": ["freeCodeCamp", "Codecademy", "LeetCode", "CS50 course"],
              "challenges": ["Learning curve", "Practice consistency"],
              "milestones": ["Complete first programming language", "Solve 100+ coding problems"]
            },
            {
              "title": "Build Full-Stack Development Skills",
              "description": "Learn both frontend and backend development. Master HTML, CSS, JavaScript, and a backend framework.",
              "timeline": "4-8 months",
              "resources": ["React documentation", "Node.js", "Express.js", "MongoDB"],
              "challenges": ["Keeping up with frameworks", "Understanding complex concepts"],
              "milestones": ["Build 3+ full-stack projects", "Deploy applications online"]
            },
            {
              "title": "Specialize and Gain Experience",
              "description": "Choose a specialization (web dev, mobile, AI/ML, etc.) and gain real-world experience through projects and internships.",
              "timeline": "6-12 months",
              "resources": ["GitHub", "LinkedIn", "Company career sites", "Personal projects"],
              "challenges": ["Competition for positions", "Building portfolio"],
              "milestones": ["Complete internship", "Contribute to open source", "Build portfolio website"]
            },
            {
              "title": "Continuous Learning and Career Advancement",
              "description": "Stay updated with new technologies, earn certifications, and advance in your career through leadership roles.",
              "timeline": "Ongoing",
              "resources": ["Technical blogs", "Conferences", "Certifications", "Mentorship"],
              "challenges": ["Keeping skills current", "Work-life balance"],
              "milestones": ["Earn senior developer position", "Mentor junior developers", "Lead technical projects"]
            }
          ],
          "salary": "$70,000 - $150,000",
          "jobMarket": "High demand with strong growth"
        };
        finalMessage = "Your custom roadmap is ready! Click the button above.";
      }
    }
    return Response.json({
      message: finalMessage,
      isRoadmapReady: roadmapData !== null,
      roadmapData: roadmapData
    });
  } catch (error) {
    console.error('API Error:', error);
    if (error.message && (error.message.includes('429') || error.message.includes('Too Many Requests') || error.message.includes('quota'))) {
      // Provide fallback career guidance when rate limited
      let fallbackMessage = '';
      let isRoadmapReady = false;
      let roadmapData = null;

      if (userMessages === 1) {
        fallbackMessage = `I understand you're interested in ${lastUserMessage}. That's a great field with excellent growth opportunities! Based on current market trends, here are some key insights for ${lastUserMessage}:

• **High Demand:** Strong job market with competitive salaries
• **Growth Areas:** Focus on emerging technologies and skills
• **Entry Points:** Multiple pathways depending on your background

To create a personalized roadmap, could you tell me about your current education level or background in this field?`;
      } else if (userMessages === 2) {
        fallbackMessage = `Thanks for sharing that information. Based on what you've told me, here's some general guidance for your career path:

**Key Skills to Develop:**
• Technical proficiency in core areas
• Problem-solving and analytical thinking
• Communication and teamwork abilities

**Career Progression:**
• Entry-level positions to build experience
• Mid-level roles with increased responsibility
• Senior positions with leadership opportunities

What are your short-term goals for the next 1-2 years?`;
      } else if (userMessages === 3) {
        fallbackMessage = `Excellent insights! Here's a comprehensive overview based on your background and goals:

**Recommended Path:**
• **Foundation Building:** Strengthen core competencies
• **Skill Development:** Focus on in-demand technologies
• **Experience Building:** Gain practical experience through projects
• **Networking:** Connect with industry professionals

**Timeline Estimate:** 2-4 years for significant career advancement

Would you like me to elaborate on any specific aspect of this career path?`;
      } else if (userMessages >= 4) {
        // Provide a generic roadmap when enough information is gathered
        fallbackMessage = `Based on our conversation, I've created a comprehensive career roadmap for you. This is designed around current industry standards and best practices.`;

        isRoadmapReady = true;
        roadmapData = {
          "career": lastUserMessage || "Your Chosen Career",
          "summary": "This roadmap provides a structured approach to building a successful career in your chosen field. It focuses on practical steps, skill development, and professional growth based on industry best practices.",
          "steps": [
            {
              "title": "Build Foundational Knowledge",
              "description": "Develop core understanding of fundamental concepts, principles, and basic skills required in your field. Focus on learning the basics thoroughly before moving to advanced topics.",
              "timeline": "3-6 months",
              "resources": ["Online courses", "Textbooks", "Documentation", "Tutorials"],
              "challenges": ["Information overload", "Finding quality resources"],
              "milestones": ["Complete introductory courses", "Understand core concepts", "Build basic projects"]
            },
            {
              "title": "Develop Specialized Skills",
              "description": "Focus on advanced skills and specialized knowledge areas that are in high demand. Learn industry-standard tools, frameworks, and methodologies.",
              "timeline": "4-8 months",
              "resources": ["Specialized courses", "Professional certifications", "Industry blogs", "Practice projects"],
              "challenges": ["Keeping up with trends", "Choosing right specializations"],
              "milestones": ["Earn relevant certifications", "Complete advanced projects", "Contribute to open source"]
            },
            {
              "title": "Gain Practical Experience",
              "description": "Apply your knowledge through real-world projects, internships, or entry-level positions. Build a portfolio showcasing your abilities and achievements.",
              "timeline": "6-12 months",
              "resources": ["Internships", "Freelance projects", "Personal portfolio", "Networking events"],
              "challenges": ["Competition for opportunities", "Building confidence"],
              "milestones": ["Complete first professional project", "Receive positive feedback", "Build comprehensive portfolio"]
            },
            {
              "title": "Advance Your Career",
              "description": "Pursue leadership roles, advanced certifications, and continuous professional development. Focus on mentoring, project management, and strategic thinking.",
              "timeline": "1-3 years",
              "resources": ["Leadership training", "Advanced certifications", "Industry conferences", "Mentorship programs"],
              "challenges": ["Career transitions", "Work-life balance", "Staying current"],
              "milestones": ["Achieve senior position", "Lead successful projects", "Mentor junior professionals"]
            }
          ],
          "salary": "$60,000 - $120,000",
          "jobMarket": "Growing demand with good opportunities"
        };
      } else {
        fallbackMessage = "I'm currently experiencing high demand and my response capacity is limited. Here's some general career advice: Focus on building strong foundational skills, gaining practical experience, and continuously learning. What specific career field interests you?";
      }

      return Response.json({
        message: fallbackMessage,
        isRoadmapReady: isRoadmapReady,
        roadmapData: roadmapData
      });
    }
    return Response.json({
      message: "An error occurred. Please try again.",
      isRoadmapReady: false,
      roadmapData: null
    }, { status: 500 });
  }
}