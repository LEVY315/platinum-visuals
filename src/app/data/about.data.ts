export interface AboutBlock {
  title: string;
  text: string;
}

export interface AboutContent {
  eyebrow: string;
  headline: string;
  paragraphs: string[];
  blocks: AboutBlock[];
}

export const ABOUT: AboutContent = {
  eyebrow: 'About Platinum Visuals',
  headline: 'Capturing Moments. Creating Memories. Telling Stories.',
  paragraphs: [
    'Founded in 2021 by Njabulo Madonsela, Platinum Visuals (PTY) LTD is a professional photography and videography company dedicated to capturing the moments that matter most.',
    'We believe that every moment has a story worth preserving. From the excitement of a matric dance to the elegance of a wedding, the celebration of a birthday, the arrival of a new life, or the achievements of a corporate event, our purpose is to transform meaningful moments into premium, timeless visual memories.',
    'At Platinum Visuals, we combine creativity, professionalism, and attention to detail to deliver photography and videography that reflects the uniqueness of every client. We take the time to understand your vision and create images and films that you will be proud to look back on for years to come.',
  ],
  blocks: [
    {
      title: 'Our Approach',
      text: 'Every client and every occasion is different. That is why we focus on creating a personalised experience while maintaining the highest standards of quality and professionalism. Whether you are looking for a single portrait, documenting a major celebration, or creating professional visual content for your business, Platinum Visuals is committed to making every frame count.',
    },
    {
      title: 'Our Vision',
      text: 'To build a trusted and recognised visual media brand known for exceptional quality, creativity, professionalism, and authentic storytelling.',
    },
    {
      title: 'Our Mission',
      text: "To preserve life's most valuable moments through premium photography and videography, creating visual stories that allow our clients to experience their memories again and again.",
    },
  ],
};
