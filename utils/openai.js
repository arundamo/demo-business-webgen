/**
 * OpenAI Helper Utility
 * Generates demo website HTML for businesses using OpenAI API
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Generate a demo website HTML for a business using OpenAI
 * @param {Object} business - Business details
 * @param {string} business.name - Business name
 * @param {string} business.address - Business address
 * @param {string} business.phone - Business phone number
 * @param {string} business.type - Business type/category
 * @returns {Promise<string>} Generated HTML content
 */
export async function generateWebsiteWithOpenAI(business) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const prompt = `Create a complete, professional HTML webpage for a local business with the following details:

Business Name: ${business.name}
Business Type: ${business.type || 'Local Business'}
Address: ${business.address}
Phone: ${business.phone || 'Contact us for details'}

Requirements:
1. Create a complete, valid HTML5 document with embedded CSS (no external stylesheets)
2. Include a modern, professional design with a color scheme appropriate for the business type
3. Sections to include:
   - Header with business name and navigation
   - Hero section with a compelling tagline
   - About Us section describing the business
   - Services section with 3-4 relevant services
   - Contact section with address, phone, and a simple contact form
   - Footer with copyright
4. Make it responsive and mobile-friendly using CSS media queries
5. Include appropriate placeholder content that sounds professional
6. Add a clear Call-to-Action button in the hero section

Return ONLY the complete HTML code, no explanations or markdown.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert web developer who creates professional, complete HTML webpages with embedded CSS. Always return only valid HTML code without any markdown formatting or explanations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API request failed');
  }

  const data = await response.json();
  const generatedContent = data.choices[0]?.message?.content || '';
  
  // Clean up the response - remove markdown code blocks if present
  let html = generatedContent.trim();
  if (html.startsWith('```html')) {
    html = html.slice(7);
  } else if (html.startsWith('```')) {
    html = html.slice(3);
  }
  if (html.endsWith('```')) {
    html = html.slice(0, -3);
  }
  
  return html.trim();
}

/**
 * Generate a fallback template website when OpenAI is not available
 * @param {Object} business - Business details
 * @returns {string} Generated HTML content
 */
export function generateFallbackTemplate(business) {
  const businessName = business.name || 'Local Business';
  const businessType = business.type || 'Professional Services';
  const address = business.address || 'Contact us for our location';
  const phone = business.phone || 'Call for information';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(businessName)} - Welcome</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        /* Header */
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            transition: opacity 0.3s;
        }
        
        .nav-links a:hover {
            opacity: 0.8;
        }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8rem 2rem 4rem;
            text-align: center;
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.25rem;
            max-width: 600px;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .cta-button {
            background: white;
            color: #667eea;
            padding: 1rem 2rem;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            text-decoration: none;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        /* Sections */
        section {
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        section h2 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 2rem;
            color: #667eea;
        }
        
        /* About Section */
        .about p {
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
            font-size: 1.1rem;
        }
        
        /* Services Section */
        .services {
            background: #f8f9fa;
        }
        
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .service-card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .service-card:hover {
            transform: translateY(-5px);
        }
        
        .service-card h3 {
            color: #667eea;
            margin-bottom: 1rem;
        }
        
        .service-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        /* Contact Section */
        .contact {
            background: #667eea;
            color: white;
        }
        
        .contact h2 {
            color: white;
        }
        
        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            text-align: center;
        }
        
        .contact-item h3 {
            margin-bottom: 0.5rem;
        }
        
        .contact-form {
            max-width: 500px;
            margin: 2rem auto 0;
        }
        
        .contact-form input,
        .contact-form textarea {
            width: 100%;
            padding: 1rem;
            margin-bottom: 1rem;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
        }
        
        .contact-form button {
            background: white;
            color: #667eea;
            padding: 1rem 2rem;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            transition: opacity 0.3s;
        }
        
        .contact-form button:hover {
            opacity: 0.9;
        }
        
        /* Footer */
        footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 2rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }
            
            .nav-links {
                display: none;
            }
            
            section {
                padding: 2rem 1rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <div class="logo">${escapeHtml(businessName)}</div>
            <ul class="nav-links">
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <section class="hero">
        <h1>Welcome to ${escapeHtml(businessName)}</h1>
        <p>Your trusted ${escapeHtml(businessType)} provider. We deliver quality service and exceptional results for all your needs.</p>
        <a href="#contact" class="cta-button">Get in Touch</a>
    </section>

    <section id="about" class="about">
        <h2>About Us</h2>
        <p>At ${escapeHtml(businessName)}, we pride ourselves on delivering exceptional ${escapeHtml(businessType.toLowerCase())} services to our community. With years of experience and a commitment to quality, we're here to help you with all your needs. Our team of dedicated professionals ensures every project is completed to the highest standards.</p>
    </section>

    <section id="services" class="services">
        <h2>Our Services</h2>
        <div class="services-grid">
            <div class="service-card">
                <div class="service-icon">⭐</div>
                <h3>Quality Service</h3>
                <p>We deliver top-notch service with attention to detail and customer satisfaction as our priority.</p>
            </div>
            <div class="service-card">
                <div class="service-icon">🕐</div>
                <h3>Fast Response</h3>
                <p>Quick turnaround times and responsive communication to meet your needs efficiently.</p>
            </div>
            <div class="service-card">
                <div class="service-icon">💎</div>
                <h3>Expert Team</h3>
                <p>Our experienced professionals bring expertise and skill to every project we undertake.</p>
            </div>
            <div class="service-card">
                <div class="service-icon">💰</div>
                <h3>Fair Pricing</h3>
                <p>Competitive rates without compromising on quality. Get the best value for your investment.</p>
            </div>
        </div>
    </section>

    <section id="contact" class="contact">
        <h2>Contact Us</h2>
        <div class="contact-info">
            <div class="contact-item">
                <h3>📍 Address</h3>
                <p>${escapeHtml(address)}</p>
            </div>
            <div class="contact-item">
                <h3>📞 Phone</h3>
                <p>${escapeHtml(phone)}</p>
            </div>
            <div class="contact-item">
                <h3>🕐 Hours</h3>
                <p>Mon-Fri: 9AM-6PM<br>Sat: 10AM-4PM</p>
            </div>
        </div>
        <form class="contact-form">
            <input type="text" placeholder="Your Name" required>
            <input type="email" placeholder="Your Email" required>
            <textarea rows="4" placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
        </form>
    </section>

    <footer>
        <p>&copy; ${new Date().getFullYear()} ${escapeHtml(businessName)}. All rights reserved.</p>
    </footer>
</body>
</html>`;
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}
