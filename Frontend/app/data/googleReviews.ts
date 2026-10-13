/**
 * Static Google reviews for the <GoogleReviews /> wall + admin seed fallback.
 * Paste real name, date, text, and each review's Google share URL.
 * Never invent or edit review text.
 * Row 1 = entries 1–10, Row 2 = entries 11–20.
 */

export const GOOGLE = {
  rating: 4.8,
  count: 320,
  allReviewsUrl:
    "https://www.google.com/search?q=Divas+Sojourn&ludocid=4921310223578344911#lrd=0x390d031a566fcb5d:0x444c0192f9e2adcf,1",
  writeReviewUrl:
    "https://www.google.com/search?q=Divas+Sojourn&ludocid=4921310223578344911#lrd=0x390d031a566fcb5d:0x444c0192f9e2adcf,3",
};

export type GoogleReview = {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
  url: string;
};

/** Default platform cards (admin can override counts/ratings in DB). */
export const PLATFORM_STATS = [
  {
    id: "google",
    platform: "Google",
    rating: 4.8,
    ratingLabel: null as string | null,
    count: 320,
    countLabel: "320+ reviews",
    href: "https://www.google.com/maps/search/?api=1&query=Divas+Sojourn+-+Travel.Discover.Friends+New+Delhi",
  },
  {
    id: "tripadvisor",
    platform: "TripAdvisor",
    rating: 5.0,
    ratingLabel: null as string | null,
    count: 80,
    countLabel: "80+ reviews",
    href: "https://www.tripadvisor.in/Attraction_Review-g297602-d12622548-Reviews-Divas_Sojourn-National_Capital_Territory_of_Delhi.html",
  },
  {
    id: "facebook",
    platform: "Facebook",
    rating: null as number | null,
    ratingLabel: "100% recommended",
    count: 50,
    countLabel: "50+ reviews",
    href: "https://www.facebook.com/divassojourn/reviews",
  },
];

export const REVIEWS: GoogleReview[] = [
  {
    id: 1,
    name: "Sonia Martis",
    date: "3 months ago",
    rating: 5,
    text: `I just completed my first trip with Divas Soujourn.  Right from the day that I registered till I returned,  everything was taken care of. The trip was very well planned and Pooja herself accompanied us and ensured that everything went on smoothly. I really appreciate the small things like providing us breakfast as soon as we disembarked from the flight in Nairobi before we started the road trip, the baggage tags and the personalised caps. It made us feel so special.  I would definitely recommend taking a trip with Divas Soujourn.  I am sure you will not be able to stop with one.  I am looking forward to many more trips with Pooja , the team and Divas Soujourn.`,
    url: "https://maps.app.goo.gl/Jvs48efHLyoy3t3WA",
  },
  {
    id: 2,
    name: "Tasneem Mukadam",
    date: "3 months ago",
    rating: 5,
    text: `Hi I recently went to Kenya with Pooja and the entire experience was beyond wonderful! The hotels, the drivers, the food etc was well taken care off. We were 10 amazing women who had great camaraderie and fun mainly because of Pooja’s calm demeanor and conduct.
I will definitely travel with them again and encourage women of all backgrounds and ages to travel with Divassojourn as it’s a safe space.`,
    url: "https://maps.app.goo.gl/8YiW5jkyhFwQEZS3A",
  },
  {
    id: 3,
    name: "Ankita Das",
    date: "8 months ago",
    rating: 5,
    text: `My Rann of Kutch trip with Divas Sojourn was nothing short of magical, soulful, and laughter-filled. From seamless planning to thoughtful execution, everything was handled with such care that the journey felt effortless and special.
A huge shoutout to Pooja — what a powerhouse of a woman! Bold, caring, organised, and deeply inspiring. I’ve truly become a fan of her leadership, maturity, and the way she takes a stand while still making everyone feel seen, safe, and valued. I learned so much just by observing her.
Special thanks to Rakhi Jaitley for always being supportive and warm — your calm presence added so much comfort to the journey 🤍
To my lovely roommate Anandiji — thank you for the peaceful vibes, sweet conversations, and positive energy. Sharing a room with you was truly pleasant.
And my laughter riot gang — Agni and Yamini — you both turned ordinary moments into unforgettable memories 😂❤️ From endless giggles to crazy conversations, you made this trip extra special.
A special mention to all the beautiful ladies from different states who were part of this journey — every story, every perspective, every conversation taught me something new about courage, independence, kindness, and truly how to live life. Traveling with such strong, diverse, and inspiring women was an experience in itself.
This trip wasn’t just about exploring the white desert; it was about connections, growth, shared stories, and memories that will stay with me forever. Thank you Divas Sojourn for creating such a safe, empowering, and uplifting space for women travelers.
Already looking forward to many more journeys together ✨🌙🏜️`,
    url: "https://maps.app.goo.gl/nxanMVvGqfNoyTi46",
  },
  {
    id: 4,
    name: "Richi Goyal",
    date: "8 months ago",
    rating: 5,
    text: `Had a really wonderful time visiting Jaisalmer with Divas Sojourn. It was my first time solo trip and I was skeptical initially but it became smooth the moment I met Mr. Sanjeev. He made sure the arrangements are up-to-date and even made up for the sweet cravings of the travellers after dinner. Now I have a group of amazing women friends from different places. Overall Super se bhi Uper experience. Looking forward to travel more often with Divas Sojourn. Thanks to Pooja, Sanjeev, Reema and entire team who made sure of each step of this trip until I reached home safely.`,
    url: "https://maps.app.goo.gl/rTTnkpY7fFDRwfP16",
  },
  {
    id: 5,
    name: "Shobha Chavan",
    date: "8 months ago",
    rating: 5,
    text: `Four of our friends had Runn of Kutch tour from 27th Dec 2025 to 2nd Jan 2026. This was our first tour with Divas Sojourn. We all are senior citizens. But during the tour we did not felt so but it was indeed rejuvenation . Pooja & Sanjeev had taken utmost  care of all of us. We had luxurious hotels to stay tasty food. Itenery & sightseeing was worthy It's worth choosing the tour.`,
    url: "https://maps.app.goo.gl/14gqDX5J1XXLqNeUA",
  },
  {
    id: 6,
    name: "Maya Kirpalani",
    date: "4 months ago",
    rating: 5,
    text: `Went to Mauritius with this group and it was the most amazing trip. It was my first solo trip and I was very apprehensive but after this trip, I have become a fan of Divas Sojourn and plan to do many more trips with them. I would recommend this to all the ladies who like travelling. Pooja , owner of Divas, accompanied us and she was so caring.`,
    url: "https://maps.app.goo.gl/Pr9NFUGubAfE4uc26",
  },
  {
    id: 7,
    name: "Alka Mane",
    date: "8 months ago",
    rating: 5,
    text: `Hi all 🙋‍♀️ Recently did a  tour arranged by Reema Divas Sojourn to celebrate New year at Runn of Kutch and recharged our body and soul to enjoy the year 2026 ahead 🥳 It was a excellent experience to celebrate New year with beautiful ladies from different states of India and we all proved our country slogan "विविधता मे एकता" 👍 Thanks to all the beautiful ladies for adding one more memorable event in my life ❤️ Hotel stay, food and transport was good. Thanks dear Pooja our tour leader for taking care of us throughout the tour and Sanjeev for making the tour successful 🙏`,
    url: "https://maps.app.goo.gl/DinD9h2CrjdcEMkK6",
  },
  {
    id: 8,
    name: "Neha Sharma",
    date: "8 months ago",
    rating: 5,
    text: `I recently went for a Rann of Kutch Trip with DIVAS SOJOURN and i must say I had an amazing time of my life with 05 other solo lady traveller's. The manager Sanjeev Jaitley did a wonderful job in managing the entire tour, he saw to it that we all were very comfortable with the way the trip was going and also with each other.  There was never a dull moment in the entire trip. The hotels/resorts chosen were impeccable. Also my birthday coincided during the trip which was made even more memorable with cake cutting and gifts by the fellow traveller's. The places we explored were also worth visiting.

Keep up the good work. Would definitely look forward to their upcoming trips.`,
    url: "https://maps.app.goo.gl/oHE7h4NXT8LFddSSA",
  },
  {
    id: 9,
    name: "Anandi Kumar",
    date: "8 months ago",
    rating: 5,
    text: `Rann of Kutch trip for last December was a treasure for me to keep in my mind. I was very confused, undetermined about taking the trip. I had no confidence in going solo trip without my family. I hesitated about mingling with the  strangers in the group. But our group leader Pooja supported me emotionally and I took the tour. Wow!!!such a lovely group of ladies, enthusiastic women... I broke the ice sheild in my mind and got mingled with all. My group surprised me by  celebrating  my birthday in  Dolavira, which was the first birthday celebrated in my life time. Thank you for everything we enjoyed.`,
    url: "https://maps.app.goo.gl/QKVSNfxKtC592hwp6",
  },
  {
    id: 10,
    name: "Basundra Dhiman",
    date: "5 months ago",
    rating: 5,
    text: `I have personally travelled with Divas Sojourn, and honestly, it was such a beautiful and memorable experience. 😊✨
From the very beginning, everything was managed so smoothly — the stays, transportation, activities, and overall coordination were all very well planned. The team was extremely supportive, friendly, and always available whenever we needed help or guidance during the trip.
One of the best parts about travelling with Divas Sojourn is that these are women-only trips, which makes the entire experience feel very safe, comfortable, and enjoyable for female travellers. You get to travel stress-free, connect with like-minded women, make new friends, and create unforgettable memories together. 💕
The atmosphere throughout the trip was so positive and welcoming that it never felt like travelling with strangers — it felt more like travelling with a family. Every moment was filled with fun, laughter, adventure, and beautiful experiences.
I genuinely had a wonderful and satisfying experience with Divas Sojourn, and I would highly recommend it to every woman who loves travelling and wants to explore new places in a safe and comfortable environment. ✨`,
    url: "https://maps.app.goo.gl/tUPmr2RdTH6rFwry6",
  },
  {
    id: 11,
    name: "Neelam Ahuja",
    date: "3 months ago",
    rating: 5,
    text: `Had an amazing Leh-Ladakh trip with Divas Sojourn. Our trip coordinator\\leader Sanjeev Sir was outstanding. Even as a male leader heading an all-women's tour, he made everyone feel completely safe and respected. His discipline and punctuality kept everything running perfectly on schedule. Huge thanks to the Divas Sojourn and all new friends for making this a smooth and memorable journey. Highly recommended!`,
    url: "https://maps.app.goo.gl/ivcZUdQ4LK5vam9Q7",
  },
  {
    id: 12,
    name: "Aadya Anil",
    date: "3 months ago",
    rating: 5,
    text: `I’d strongly recommend traveling with Pooja and the Divas Sojourn team. I recently went on a Kenya trip with them, and everything was well organized with a thoughtfully planned itinerary.
The overall experience was smooth and memorable. Thank you to Pooja and the entire team for making it so special!`,
    url: "https://maps.app.goo.gl/LbRGWjkAq4v1zUvu7",
  },
  {
    id: 13,
    name: "Niketa Shah",
    date: "3 months ago",
    rating: 5,
    text: `I had taken a solo trip for the first time at Kenya safari park with Divas sojourn , it's very wonderful experience ,after coming back two days back but feel  like it's not over,I miss all the fun & moments with wonderful group,every night  comes in dream ,pooja founder of the divas sojourn is very humble lady ,care taker and reachable anytime .I am jain so in the whole seven days she had taken good care of my food part too. Love to join them in near future at the earliest.`,
    url: "https://maps.app.goo.gl/cV3KVSyhrGZEwmMe7",
  },
  {
    id: 14,
    name: "Ritz JJ",
    date: "A year ago",
    rating: 5,
    text: `I had the opportunity to travel with the travel divas and with Sanjeev our most amazing guide. The trip was extremely well organized, well paced and loads of fun. We got to see all the highlights of Vietnam in 6 days and the company was great too! Well travelled mature women who were so much fun`,
    url: "https://maps.app.goo.gl/u4FXQf8RAFdDVgsa6",
  },
  {
    id: 15,
    name: "Hetal",
    date: "4 months ago",
    rating: 5,
    text: `5/5 Stars ⭐⭐⭐⭐⭐
​Exceptional Tawang Tour with Unmatched Care!
​I recently returned from a trip to Tawang with Divas Sojourn, and I cannot recommend them highly enough. From start to finish, everything was flawlessly planned and executed.
​The itinerary was incredibly well-thought-out, allowing us to experience the beauty of Tawang without feeling rushed. Every detail, from transport to accommodations, was perfectly managed.
​What truly set Divas Sojourn apart, however, was their incredible hospitality. During the tour, I fell unwell, and the team went completely above and beyond to take care of me. Their genuine concern, prompt support, and attentiveness made me feel safe and cared for, even far away from home. It is rare to find a travel company that treats you like family when things don’t go perfectly.
​If you are looking for a hassle-free, memorable, and deeply caring travel experience, look no further than Divas Sojourn. Thank you to the entire team for making this trip so special!
Special thanks to Mr. Sanjiv Jetli who is the main person looked after everything so nicely.
Divas is a specially organised tour planner for womens.
As we all know going alone without family is something which create tension in us.
But a person like Sanjeev is truly appreciated peeson.

I will surely join this group in future too.
They have lot of gifts, reward point system etc with them.

I suggest all women's.... Without any tension join this tour....

Thanks again Divas and special thanks to Sanjeev.`,
    url: "https://maps.app.goo.gl/h2DFjGi59DtbJEYM8",
  },
  {
    id: 16,
    name: "Rajni Bains",
    date: "6 months ago",
    rating: 5,
    text: `A Divine and Well-Organized Ujjain-Indore Spiritual Journey

I recently returned from an unforgettable devotional trip to Ujjain and Indore, flawlessly managed by our tour manager Mr. Sanjeev Jaitly. From seamless darshan at Mahakaleshwar Temple (including the personal Rudraksha pooja) to the sacred vibes at Omkareshwar's Mamleshwar, Har Siddhi, Gudakalika, Kal Bhairav, and Mangalnath temples every key site was covered without a hitch. In Indore, we explored rich history of Holkar's - Lalbagh Palace and Rajwada Palace plus divine blessings at Annapurna Temple and Khajrana Ganesh Temple—truly a perfect blend of spirituality and heritage.

Mr. Jaitly's supportive nature shone through, he took excellent care of all members, handling every detail with patience and enthusiasm. Accommodations were top-notch—comfortable and clean—while the food was a highlight, with delicious, sattvic meals that kept everyone energized. The fun-filled devotional atmosphere peaked along the serene Narmada River and our group of supportive tour members made it even more memorable bonding over shared chants and stories.

This trip was pure bliss: devotional, organized and rejuvenating. Highly recommend for anyone seeking a hassle-free pilgrimage! Jai Mahakaal...Har Har Mahadev...

5/5 Stars: Divine Gujarat Journey with Divas Sojourn – Pure Bliss!

My recent Divas Sojourn trip through Gujarat's spiritual gems—Dwarka Temple, Somnath, Sasan Gir, and Diu—was nothing short of amazing and life-enriching. The hotel accommodations were luxurious and well-chosen, with stunning views, and the food was exceptional—fresh, flavorful Gujarati thalis and delights that hit all the right notes.

The full itinerary was meticulously covered: serene darshans at the majestic Dwarka Temple and Somnath Jyotirlinga, an exhilarating wildlife safari spotting Asiatic lions in Sasan Gir, and relaxing beach vibes along with water sports in Diu. Our tour manager was outstanding—super supportive, incredibly accommodating with personal requests, and ensured every moment felt seamless and special. Book with Divas Sojourn for an unforgettable holistic adventure!`,
    url: "https://maps.app.goo.gl/Z38EUsHWG8M9m5oi6",
  },
  {
    id: 17,
    name: "Rajitha Jaffer",
    date: "A year ago",
    rating: 5,
    text: `Had the opportunity to travel to Vietnam organised by Divas Sojourn. It was a well curated tour for 6 days with a group of lovely girls and Sanjeev, our tour coordinator from Divas. Sanjeev was meticulous in his responsibility towards us. We all started off as strangers but ended being great friends. A special mention about Ms. Nidhi who was the SPOC for me till the tour kicked off. She is a lovely person who attended promptly to my queries and concerns and made me at ease. Look forward to future travels with Divas.`,
    url: "https://maps.app.goo.gl/vGBhkLkF1jfXG9Rw6",
  },
  {
    id: 18,
    name: "Sunita Tomar",
    date: "4 months ago",
    rating: 5,
    text: `It was a dream come true trip for me and i am so grateful to god for helping me Choose Divas Sojourn ❤️🙏❤️
A big heartfelt thank you for inviting me to this trip . Special thanks to Sanjeev Jaitley  for managing the trip and people so beautifully and allowing us to enjoy it to the fullest, A man you felt safe with and who looked after the ladies with utmost care and concern .
Thank you  for taking us to the river side .
Saare pahaad, jharne , kal kal behti pahadi nadiyon ke kinaare baithne ka sukh aanand , Akio Hut jaisi sundar jagah baith kar khaane ka sukh ,
Also good arrangement of breakfast and dinner 🙏
Sab ek hi trip mein mil gaya . Mera bas yahi sapna tha jo poora ho gaya .
Lots of Gratitude to every group member who have become a family now !
Grateful for everything!
God bless ! 🙏❤️🙏❤️🙏❤️🙏
Stay connected!`,
    url: "https://maps.app.goo.gl/iwYTmbdzsgawaNUJ9",
  },
  {
    id: 19,
    name: "Abha Badola",
    date: "3 months ago",
    rating: 5,
    text: `Truly amazing!
It was my first ever solo trip so a totally refreshing experience, looking forward to the next one 🌄☺️ …`,
    url: "https://maps.app.goo.gl/8aw7bM7VWzrkBdr4A",
  },
  {
    id: 20,
    name: "Parna Halder",
    date: "6 months ago",
    rating: 5,
    text: `My trip to Bangkok was an incredible experience, especially since it was my first solo journey with Diva Sojourn. Pooja accompanied us throughout the trip, attentively catering to all our needs with remarkable flexibility and warmth. Her support made the entire journey smooth and enjoyable. This memorable adventure has inspired me to choose Diva Sojourn again for my future travels, as I look forward to creating even more amazing experiences.`,
    url: "https://maps.app.goo.gl/JxK2xo9RZqLtcRXu5",
  },
];
