/**
 * API Route: Generate demo website for a business
 * Uses OpenAI API with fallback template
 */

import { generateWebsiteWithOpenAI, generateFallbackTemplate } from '@/utils/openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { business } = req.body;

  if (!business || !business.name) {
    return res.status(400).json({ error: 'Business information is required' });
  }

  try {
    let html;
    let source;

    // Use fallback template if mock mode is enabled or OpenAI key is not configured
    if (USE_MOCK_DATA || !OPENAI_API_KEY) {
      html = generateFallbackTemplate(business);
      source = 'template';
      
      return res.status(200).json({
        html,
        source,
        message: !OPENAI_API_KEY 
          ? 'Generated using template - OpenAI API key not configured' 
          : 'Generated using template as configured',
      });
    }

    // Try to generate with OpenAI
    try {
      html = await generateWebsiteWithOpenAI(business);
      source = 'openai';
      
      return res.status(200).json({
        html,
        source,
        message: 'Generated using OpenAI',
      });
    } catch (openaiError) {
      console.error('OpenAI error:', openaiError);
      
      // Fallback to template on OpenAI error
      html = generateFallbackTemplate(business);
      source = 'template';
      
      return res.status(200).json({
        html,
        source,
        message: `Fallback to template due to OpenAI error: ${openaiError.message}`,
      });
    }
  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({ error: 'Failed to generate website' });
  }
}
