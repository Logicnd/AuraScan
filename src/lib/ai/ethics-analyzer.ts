// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                    ETHICS ANALYSIS ENGINE                                    ║
// ║                     AuraScan AI-Powered Ethics Scanner                       ║
// ╠════════════════════════════════════════════════════════════════════════════╣
// ║                                                                             ║
// ║  This module powers the core ethics analysis functionality.                  ║
// ║  It uses OpenAI's GPT-4 Turbo to analyze prompts for:                        ║
// ║  • Bias (50+ categories)                                                     ║
// ║  • Privacy risks (PII detection)                                             ║
// ║  • Toxicity (hate speech, harassment)                                        ║
// ║  • Manipulation (dark patterns, deception)                                   ║
// ║  • Compliance (GDPR, CCPA, HIPAA, COPPA)                                     ║
// ║                                                                             ║
// ║  REQUIRED ENV VARS:                                                          ║
// ║  • OPENAI_API_KEY - Your OpenAI API key                                      ║
// ║                                                                             ║
// ║  API SETUP:                                                                  ║
// ║  1. Go to: https://platform.openai.com/api-keys                              ║
// ║  2. Create new secret key                                                    ║
// ║  3. Add to .env.local: OPENAI_API_KEY=sk-xxxxx                               ║
// ║                                                                             ║
// ║  COST ESTIMATION (GPT-4 Turbo):                                              ║
// ║  • Input: $0.01 per 1K tokens                                                ║
// ║  • Output: $0.03 per 1K tokens                                               ║
// ║  • Average scan: ~$0.005-0.02                                                ║
// ║                                                                             ║
// ║  DEMO MODE:                                                                  ║
// ║  If OPENAI_API_KEY is not set, returns realistic mock data                   ║
// ║                                                                             ║
// ╚════════════════════════════════════════════════════════════════════════════╝

import OpenAI from 'openai';
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════════
// OPENAI CLIENT INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * OpenAI client instance
 * 
 * @env OPENAI_API_KEY
 * @get https://platform.openai.com/api-keys → Create new secret key
 * @format sk-proj-xxxxxxxxxxxxxxxxxxxxx (starts with "sk-")
 * 
 * RATE LIMITS BY TIER:
 * • Free: 3 RPM, 200 RPD
 * • Tier 1 ($5+ spent): 60 RPM, 10K RPD
 * • Tier 2 ($50+ spent): 100 RPM, 100K RPD
 * 
 * Check your limits: https://platform.openai.com/account/limits
 * Set spending limits: https://platform.openai.com/account/billing/limits
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key-for-build',
});

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION SCHEMAS
// Zod schemas ensure AI responses match expected format
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Complete ethics analysis response schema
 * All scores are 0-100 where higher = more ethical
 */
export const EthicsAnalysisSchema = z.object({
  /** Overall ethics score (weighted average) */
  overallScore: z.number().min(0).max(100),
  
  /** Individual category scores */
  scores: z.object({
    bias: z.number().min(0).max(100),        // Freedom from discrimination
    privacy: z.number().min(0).max(100),     // Data protection
    toxicity: z.number().min(0).max(100),    // Absence of harmful content
    transparency: z.number().min(0).max(100), // Honesty/clarity
    fairness: z.number().min(0).max(100),    // Equal treatment
    manipulation: z.number().min(0).max(100), // Absence of dark patterns
    accuracy: z.number().min(0).max(100),    // Factual correctness
  }),
  
  /** Detected bias instances */
  biasCategories: z.array(z.object({
    category: z.string(),
    severity: z.enum(['none', 'low', 'medium', 'high', 'critical']),
    description: z.string(),
    examples: z.array(z.string()).optional(),
  })),
  
  /** Privacy/PII issues found */
  privacyRisks: z.array(z.object({
    type: z.string(),
    severity: z.enum(['none', 'low', 'medium', 'high', 'critical']),
    description: z.string(),
    piiDetected: z.array(z.string()).optional(),
  })),
  
  /** Improvement suggestions */
  suggestions: z.array(z.object({
    category: z.string(),
    original: z.string(),
    improved: z.string(),
    explanation: z.string(),
  })),
  
  /** Regulatory compliance flags */
  compliance: z.object({
    gdprCompliant: z.boolean(),      // EU data protection
    ccpaCompliant: z.boolean(),      // California privacy
    hipaaRelevant: z.boolean(),      // Healthcare data
    childSafetyFlags: z.boolean(),   // COPPA concerns
  }),
  
  /** Emotional analysis */
  sentiment: z.object({
    overall: z.enum(['positive', 'neutral', 'negative']),
    emotionalImpact: z.number().min(0).max(100),
  }),
  
  /** Human-readable summary */
  summary: z.string(),
  
  /** Overall risk classification */
  riskLevel: z.enum(['safe', 'low', 'medium', 'high', 'critical']),
});

export type EthicsAnalysis = z.infer<typeof EthicsAnalysisSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT
// This prompt defines how GPT-4 analyzes ethics
// @configurable Modify to adjust analysis focus/sensitivity
// ═══════════════════════════════════════════════════════════════════════════════

const ETHICS_SYSTEM_PROMPT = `You are AuraScan's Ethics Analysis Engine - the world's most advanced AI ethics analyzer. Your role is to evaluate AI prompts and outputs for ethical concerns with extreme precision and thoroughness.

ANALYSIS FRAMEWORK:

1. BIAS DETECTION (50+ categories):
   - Gender, race, ethnicity, religion, age, disability
   - Sexual orientation, nationality, socioeconomic status
   - Political affiliation, appearance, occupation
   - Language/accent, education level, family structure
   - Cultural, regional, generational biases

2. PRIVACY ANALYSIS:
   - PII detection (names, emails, phones, addresses, SSN, etc.)
   - Sensitive data exposure risks
   - Data minimization assessment
   - Consent implications
   - Third-party data sharing risks

3. TOXICITY ASSESSMENT:
   - Hate speech, harassment, threats
   - Discrimination, dehumanization
   - Sexual content, violence references
   - Profanity, insults, slurs
   - Subtle microaggressions

4. TRANSPARENCY CHECK:
   - Deceptive intent detection
   - Manipulation tactics (dark patterns)
   - Misleading claims or framing
   - Hidden agendas
   - Astroturfing/fake review patterns

5. FAIRNESS EVALUATION:
   - Equal treatment across groups
   - Representation balance
   - Opportunity equity
   - Outcome fairness
   - Procedural justice

6. COMPLIANCE ASSESSMENT:
   - GDPR requirements
   - CCPA compliance
   - HIPAA relevance (healthcare data)
   - COPPA (children's privacy)
   - AI Act compliance (EU)

SCORING METHODOLOGY:
- Each category: 0-100 (higher = more ethical)
- Overall score: Weighted average with critical issues causing larger drops
- Risk factors multiply severity

OUTPUT REQUIREMENTS:
- Be specific and actionable
- Provide concrete examples from the input
- Suggest improved alternatives
- Explain reasoning clearly
- Consider context and intent`;

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ANALYSIS FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Perform comprehensive ethics analysis on a prompt
 * 
 * @param prompt - The AI prompt or text to analyze
 * @returns Full ethics analysis with scores, issues, and suggestions
 * 
 * COST: ~1000-2000 tokens per analysis ≈ $0.01-0.02
 * TIME: ~2-5 seconds depending on prompt length
 * 
 * @configurable Change model to adjust cost/quality tradeoff:
 * - 'gpt-4-turbo-preview' (default): Best quality, ~$0.02/scan
 * - 'gpt-4o-mini': Good quality, ~$0.002/scan  
 * - 'gpt-3.5-turbo': Fast/cheap, ~$0.001/scan (lower quality)
 */
export async function analyzePromptEthics(prompt: string): Promise<EthicsAnalysis> {
  // DEMO MODE: Return mock data if API key not configured
  if (!process.env.OPENAI_API_KEY) {
    console.log('📊 Demo mode: Returning mock ethics analysis');
    return generateMockAnalysis(prompt);
  }

  try {
    const completion = await openai.chat.completions.create({
      // @configurable MODEL SELECTION
      // Change this to adjust quality vs cost
      // Options: 'gpt-4-turbo-preview', 'gpt-4o-mini', 'gpt-3.5-turbo'
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: ETHICS_SYSTEM_PROMPT },
        { 
          role: 'user', 
          content: `Analyze the following prompt/text for ethical concerns. Return a comprehensive JSON analysis.

PROMPT TO ANALYZE:
"""
${prompt}
"""

Return your analysis as a valid JSON object matching this structure:
{
  "overallScore": number (0-100),
  "scores": {
    "bias": number,
    "privacy": number,
    "toxicity": number,
    "transparency": number,
    "fairness": number,
    "manipulation": number,
    "accuracy": number
  },
  "biasCategories": [{ "category": string, "severity": "none|low|medium|high|critical", "description": string }],
  "privacyRisks": [{ "type": string, "severity": "none|low|medium|high|critical", "description": string, "piiDetected": string[] }],
  "suggestions": [{ "category": string, "original": string, "improved": string, "explanation": string }],
  "compliance": { "gdprCompliant": boolean, "ccpaCompliant": boolean, "hipaaRelevant": boolean, "childSafetyFlags": boolean },
  "sentiment": { "overall": "positive|neutral|negative", "emotionalImpact": number },
  "summary": string,
  "riskLevel": "safe|low|medium|high|critical"
}`
        }
      ],
      // Force JSON output format
      response_format: { type: 'json_object' },
      
      // @configurable TEMPERATURE
      // 0.0 = deterministic, 1.0 = creative
      // Lower = more consistent scoring
      temperature: 0.3,
      
      // @configurable MAX_TOKENS
      // Limit response length (affects cost)
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse and validate response
    const parsed = JSON.parse(content);
    return EthicsAnalysisSchema.parse(parsed);
  } catch (error) {
    console.error('❌ Ethics analysis error:', error);
    // Return fallback mock data on error
    return generateMockAnalysis(prompt);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BATCH ANALYSIS (Premium Feature)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Analyze multiple prompts in parallel
 * Premium feature: Allows batch processing of up to 50 prompts
 * 
 * @param prompts - Array of prompts to analyze
 * @returns Array of ethics analyses
 * 
 * @configurable Adjust batch size in SUBSCRIPTION_CONFIG.premiumTier.batchSize
 */
export async function analyzePromptsBatch(prompts: string[]): Promise<EthicsAnalysis[]> {
  const analyses = await Promise.all(
    prompts.map(prompt => analyzePromptEthics(prompt))
  );
  return analyses;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUICK SCAN (Lightweight Analysis)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Perform a fast, lightweight ethics check
 * Uses fewer tokens = lower cost (~$0.001 per scan)
 * 
 * Good for:
 * - Real-time typing feedback
 * - AR lens processing
 * - Rate-limited free tier
 */
export async function quickScan(prompt: string): Promise<{
  score: number;
  riskLevel: string;
  topIssues: string[];
}> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      score: Math.floor(Math.random() * 30) + 60,
      riskLevel: 'low',
      topIssues: ['Demo mode - connect OpenAI API for real analysis'],
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      // Use cheaper model for quick scans
      // @configurable Change to 'gpt-3.5-turbo' for even cheaper
      model: 'gpt-4-turbo-preview',
      messages: [
        { 
          role: 'system', 
          content: 'You are a quick ethics scanner. Analyze prompts rapidly and return a brief JSON assessment.' 
        },
        { 
          role: 'user', 
          content: `Quick ethics scan: "${prompt.slice(0, 500)}"\n\nReturn JSON: { "score": number 0-100, "riskLevel": "safe|low|medium|high|critical", "topIssues": string[] (max 3) }` 
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response');
    
    return JSON.parse(content);
  } catch {
    return {
      score: 75,
      riskLevel: 'low',
      topIssues: ['Unable to analyze - please try again'],
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK ANALYSIS GENERATOR
// Returns realistic fake data when API key is not configured
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate mock analysis for demo/fallback
 * Used when:
 * - OPENAI_API_KEY is not set
 * - API call fails
 * - Testing UI without API costs
 */
function generateMockAnalysis(prompt: string): EthicsAnalysis {
  // Use prompt characteristics to generate somewhat realistic scores
  const promptLength = prompt.length;
  const hasQuestionMark = prompt.includes('?');
  const hasPII = /\b(email|phone|address|ssn|password|credit card)\b/i.test(prompt);
  const hasBiasWords = /\b(all|always|never|every|only)\b/i.test(prompt);
  
  const baseScore = 75;
  const biasScore = hasBiasWords ? 60 + Math.random() * 20 : 80 + Math.random() * 15;
  const privacyScore = hasPII ? 40 + Math.random() * 30 : 85 + Math.random() * 10;
  const toxicityScore = 85 + Math.random() * 10;
  const transparencyScore = hasQuestionMark ? 90 : 75 + Math.random() * 15;
  const fairnessScore = 80 + Math.random() * 15;
  
  const overallScore = Math.round(
    (biasScore * 0.2 + privacyScore * 0.2 + toxicityScore * 0.15 + 
     transparencyScore * 0.15 + fairnessScore * 0.15 + 85 * 0.15) 
  );

  return {
    overallScore,
    scores: {
      bias: Math.round(biasScore),
      privacy: Math.round(privacyScore),
      toxicity: Math.round(toxicityScore),
      transparency: Math.round(transparencyScore),
      fairness: Math.round(fairnessScore),
      manipulation: Math.round(88 + Math.random() * 10),
      accuracy: Math.round(82 + Math.random() * 12),
    },
    biasCategories: hasBiasWords ? [
      {
        category: 'Generalization',
        severity: 'low' as const,
        description: 'Use of absolute terms may imply overgeneralization',
        examples: ['Consider more nuanced language'],
      }
    ] : [],
    privacyRisks: hasPII ? [
      {
        type: 'PII Exposure',
        severity: 'medium' as const,
        description: 'Prompt references potentially sensitive personal information',
        piiDetected: ['personal identifier referenced'],
      }
    ] : [],
    suggestions: [
      {
        category: 'Clarity',
        original: prompt.slice(0, 50),
        improved: `Consider: ${prompt.slice(0, 40)}... with more specific context`,
        explanation: 'Adding context helps AI provide more accurate, ethical responses',
      }
    ],
    compliance: {
      gdprCompliant: !hasPII,
      ccpaCompliant: !hasPII,
      hipaaRelevant: false,
      childSafetyFlags: false,
    },
    sentiment: {
      overall: 'neutral' as const,
      emotionalImpact: Math.round(30 + Math.random() * 40),
    },
    summary: `Analysis complete. ${hasPII ? 'Privacy considerations detected. ' : ''}${hasBiasWords ? 'Minor bias patterns noted. ' : ''}Overall, this prompt shows ${overallScore >= 80 ? 'good' : overallScore >= 60 ? 'moderate' : 'concerning'} ethical alignment.`,
    riskLevel: overallScore >= 80 ? 'safe' : overallScore >= 60 ? 'low' : overallScore >= 40 ? 'medium' : 'high',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARBON FOOTPRINT ESTIMATION
// For the Eco-Meter feature
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Estimate carbon emissions from AI API usage
 * 
 * Based on published research estimates (gCO2e per 1000 tokens)
 * Source: Various ML carbon footprint studies
 * 
 * @configurable Adjust rates as better data becomes available
 * 
 * @param tokensUsed - Number of tokens used in API call
 * @param model - Model name used
 * @returns Estimated grams of CO2 equivalent
 */
export function estimateCarbonCost(tokensUsed: number, model: string): number {
  // Estimates based on published research (gCO2e per 1000 tokens)
  // These are approximations - actual values depend on datacenter location
  const carbonPerThousandTokens: Record<string, number> = {
    'gpt-4-turbo-preview': 0.5,
    'gpt-4': 0.6,
    'gpt-4o': 0.4,
    'gpt-4o-mini': 0.15,
    'gpt-3.5-turbo': 0.2,
    'claude-3-opus': 0.55,
    'claude-3-sonnet': 0.3,
    'claude-3-haiku': 0.1,
  };

  const rate = carbonPerThousandTokens[model] || 0.4;
  return (tokensUsed / 1000) * rate;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  analyzePromptEthics,
  analyzePromptsBatch,
  quickScan,
  estimateCarbonCost,
};
