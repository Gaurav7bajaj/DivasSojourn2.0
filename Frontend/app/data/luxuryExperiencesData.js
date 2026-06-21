export const luxuryCategories = [
  {
    id: "wellness",
    title: "Wellness & Rejuvenation",
    subtitle: "Restore Your Soul",
    description:
      "Escape the noise. These luxury wellness retreats blend ancient healing traditions with modern comfort — from Ayurvedic spas in Kerala's backwaters to Balinese mountain sanctuaries. Every detail is designed to help you breathe, slow down, and return transformed.",
    bannerImage:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1800&q=85",
    trips: [
      {
        id: "w1",
        title: "Kerala Ayurvedic Wellness Retreat",
        image:
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85",
        duration: "5N / 6D",
        pickup: "Cochin International Airport",
        drop: "Cochin International Airport",
        price: 89000,
        overview:
          "Immerse yourself in the ancient science of Ayurveda at a luxury lakeside resort in Alleppey. This retreat features daily yoga with a certified master, personalized Ayurvedic consultations, Panchakarma therapies, backwater sunset cruises, and authentic Kerala cooking workshops. Stay in heritage-style villas overlooking the paddy fields and wake to the sounds of nature.",
        itinerary: [
          { day: 1, title: "Arrival & Welcome Ceremony", description: "Arrive at Cochin, private transfer to Alleppey resort. Welcome Ayurvedic consultation, dosha assessment, and relaxation with a sunset backwater boat ride." },
          { day: 2, title: "Yoga & Panchakarma Begins", description: "Morning yoga and meditation at sunrise. Personalized Panchakarma therapy sessions. Afternoon guided village walk through paddy fields and local life." },
          { day: 3, title: "Backwater Cruise & Cooking", description: "Full-day houseboat experience through Kerala backwaters. Hands-on Kerala cooking workshop with a local chef. Evening candlelit dinner by the lake." },
          { day: 4, title: "Deep Healing Day", description: "Extended spa day with Abhyanga massage, Shirodhara, and herbal steam bath. Afternoon breathwork and sound healing session. Free time for journaling and reflection." },
          { day: 5, title: "Cultural Immersion", description: "Visit ancient temples and spice plantations. Traditional Kathakali dance performance. Farewell dinner under the stars with live music." },
          { day: 6, title: "Departure", description: "Final sunrise yoga session. Healthy breakfast and Ayurvedic wellness kit to take home. Private transfer to Cochin airport." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=900&q=85",
        ],
      },
      {
        id: "w2",
        title: "Bali Mountain Sanctuary Retreat",
        image:
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
        duration: "6N / 7D",
        pickup: "Ngurah Rai International Airport, Bali",
        drop: "Ngurah Rai International Airport, Bali",
        price: 125000,
        overview:
          "A transformative wellness escape in Ubud's lush highlands. Stay at a luxury eco-resort nestled among rice terraces with daily yoga, Balinese healing rituals, waterfall treks, sacred temple visits, and farm-to-table dining. This retreat combines physical renewal with spiritual exploration in one of the world's most serene settings.",
        itinerary: [
          { day: 1, title: "Arrival in Paradise", description: "Airport pickup, transfer to Ubud luxury eco-resort. Welcome flower bath ritual and Balinese blessing ceremony. Sunset dinner overlooking the jungle canopy." },
          { day: 2, title: "Yoga & Rice Terrace Walk", description: "Sunrise yoga on the open-air pavilion. Guided walk through Tegalalang Rice Terraces. Afternoon Balinese massage and meditation." },
          { day: 3, title: "Waterfall & Purification", description: "Trek to Tegenungan Waterfall. Sacred water purification ceremony at Tirta Empul Temple. Evening sound healing with singing bowls." },
          { day: 4, title: "Art & Culture Day", description: "Visit Ubud Art Market and Royal Palace. Private Batik painting workshop. Traditional Balinese cooking class with organic ingredients." },
          { day: 5, title: "Volcano Sunrise", description: "Pre-dawn trek to Mount Batur for sunrise. Hot spring soak after the trek. Afternoon at leisure with optional spa treatments." },
          { day: 6, title: "Ocean & Ceremony", description: "Day trip to Tanah Lot sea temple. Beach yoga session. Farewell Balinese dinner with traditional dance performance." },
          { day: 7, title: "Departure", description: "Final morning meditation. Wellness breakfast and departure transfer to airport." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=85",
        ],
      },
      {
        id: "w3",
        title: "Uttarakhand Himalayan Wellness",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=85",
        duration: "4N / 5D",
        pickup: "Jolly Grant Airport, Dehradun",
        drop: "Jolly Grant Airport, Dehradun",
        price: 72000,
        overview:
          "A boutique Himalayan retreat in Rishikesh combining yoga at the birthplace of yoga, Ganga aarti meditation, nature treks through Rajaji National Park, and luxury glamping under star-filled skies. Perfect for those seeking spiritual grounding and mountain serenity.",
        itinerary: [
          { day: 1, title: "Arrival in Rishikesh", description: "Airport transfer to luxury ashram-resort. Evening Ganga Aarti ceremony at Triveni Ghat. Welcome dinner with Himalayan cuisine." },
          { day: 2, title: "Yoga Capital Experience", description: "Sunrise yoga at the Beatles Ashram. Visit Ram Jhula and Laxman Jhula. Afternoon meditation and pranayama session by the Ganges." },
          { day: 3, title: "Nature & Adventure", description: "Morning trek through Rajaji National Park. River rafting on the Ganges. Evening bonfire and stargazing from the resort terrace." },
          { day: 4, title: "Spiritual Immersion", description: "Visit Neelkanth Mahadev Temple. Guided silent meditation walk. Himalayan sound therapy and spa treatments. Farewell dinner." },
          { day: 5, title: "Departure", description: "Sunrise meditation, breakfast, and transfer to Dehradun airport." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=85",
        ],
      },
    ],
  },
  {
    id: "romance",
    title: "Romance & Honeymoon",
    subtitle: "Where Forever Begins",
    description:
      "Celebrate love in the world's most breathtaking settings. From overwater villas in the Maldives to cliffside sunsets in Santorini, these luxury honeymoon escapes are crafted for couples who want nothing less than extraordinary. Private dinners, spa rituals for two, and moments you'll treasure forever.",
    bannerImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85",
    trips: [
      {
        id: "r1",
        title: "Maldives Overwater Luxury",
        image:
          "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85",
        duration: "5N / 6D",
        pickup: "Velana International Airport, Malé",
        drop: "Velana International Airport, Malé",
        price: 245000,
        overview:
          "The ultimate romantic escape in the Maldives. Stay in an overwater villa with a private infinity pool, enjoy sunset dolphin cruises, underwater dining experiences, couples' spa treatments, and a private sandbank dinner under the stars. Crystal-clear waters and pristine white beaches create the backdrop for an unforgettable love story.",
        itinerary: [
          { day: 1, title: "Arrival in Paradise", description: "Speedboat transfer to private island resort. Check into overwater villa with private pool. Welcome champagne and sunset canapes on your deck." },
          { day: 2, title: "Ocean Adventures", description: "Sunrise snorkeling at the house reef. Couples spa treatment with ocean views. Sunset dolphin cruise followed by private beach dinner." },
          { day: 3, title: "Underwater Wonder", description: "Glass-bottom boat excursion. Underwater restaurant dining experience. Afternoon at leisure. Evening stargazing from your villa deck." },
          { day: 4, title: "Island Hopping", description: "Visit a local Maldivian island for cultural immersion. Private sandbank picnic lunch. Water sports — jet skiing, parasailing. Romantic sunset photography session." },
          { day: 5, title: "Blissful Day", description: "Morning yoga on the beach. Full spa day with Maldivian rituals. Private farewell dinner on the beach with live music." },
          { day: 6, title: "Departure", description: "Floating breakfast in your villa pool. Leisurely checkout and speedboat transfer to airport." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
        ],
      },
      {
        id: "r2",
        title: "Santorini & Mykonos Romantic Escape",
        image:
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=85",
        duration: "6N / 7D",
        pickup: "Athens International Airport",
        drop: "Athens International Airport",
        price: 275000,
        overview:
          "A dreamy Greek island honeymoon through Santorini and Mykonos. Stay in cave hotels with caldera views, enjoy private catamaran sunset cruises, wine tasting at volcanic vineyards, hot spring visits, and candlelit dinners overlooking the Aegean. The perfect blend of romance, culture, and Mediterranean luxury.",
        itinerary: [
          { day: 1, title: "Arrive in Santorini", description: "Ferry from Athens to Santorini. Check into cave hotel in Oia with caldera views. Evening walk through Oia's famous sunset point." },
          { day: 2, title: "Volcano & Hot Springs", description: "Catamaran cruise to the volcanic island. Swim in natural hot springs. BBQ lunch on board. Sunset sailing with champagne." },
          { day: 3, title: "Wine & Culture", description: "Visit Santo Wines for volcanic wine tasting. Explore Akrotiri archaeological site. Private dinner at a cliffside restaurant." },
          { day: 4, title: "Ferry to Mykonos", description: "Morning at leisure in Santorini. Afternoon ferry to Mykonos. Check into boutique hotel. Evening stroll through Mykonos Town and Little Venice." },
          { day: 5, title: "Mykonos Beach Life", description: "Visit Paradise and Super Paradise beaches. Water sports and beach club experience. Sunset cocktails at a rooftop bar." },
          { day: 6, title: "Delos Island Excursion", description: "Day trip to the sacred island of Delos. Guided archaeological tour. Farewell dinner at a traditional Greek taverna." },
          { day: 7, title: "Departure", description: "Morning at leisure. Ferry back to Athens and airport transfer." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?auto=format&fit=crop&w=900&q=85",
        ],
      },
      {
        id: "r3",
        title: "Seychelles Private Island Romance",
        image:
          "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=900&q=85",
        duration: "4N / 5D",
        pickup: "Seychelles International Airport",
        drop: "Seychelles International Airport",
        price: 198000,
        overview:
          "An exclusive Seychelles escape across Mahé, Praslin, and La Digue. Stay in luxury beachfront villas surrounded by granite boulders and turquoise waters. Includes private reef safari, giant tortoise encounters, Creole cooking masterclass, and intimate beach dinners. Nature's own paradise for couples.",
        itinerary: [
          { day: 1, title: "Arrival on Mahé", description: "Private transfer to beachfront villa. Afternoon at leisure on Anse Intendance beach. Welcome Creole dinner by candlelight." },
          { day: 2, title: "Private Reef Safari", description: "Glass-bottom boat, snorkeling, and Moyenne Island visit with giant tortoises. Creole buffet lunch included. Evening spa treatment for two." },
          { day: 3, title: "Praslin & La Digue", description: "Full-day excursion to Praslin and La Digue. Visit Vallée de Mai, cycle through La Digue, and swim at Anse Source d'Argent — the world's most photographed beach." },
          { day: 4, title: "Culture & Cuisine", description: "Creole cooking masterclass at Craft Village. Scenic coastal drive. Private sunset beach dinner with live Sega music." },
          { day: 5, title: "Departure", description: "Leisurely breakfast on the terrace. Beach time and airport transfer." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
        ],
      },
    ],
  },
  {
    id: "wildlife",
    title: "Wildlife & Adventure",
    subtitle: "Into the Untamed",
    description:
      "For the bold and the brave. These luxury adventure experiences take you into the heart of the wild — from the savannahs of Kenya to the Arctic aurora of Russia. Private game drives, bush dinners under African skies, Northern Lights hunts, and encounters with the Big Five. Adventure has never been this refined.",
    bannerImage:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1800&q=85",
    trips: [
      {
        id: "a1",
        title: "Kenya Luxury Safari",
        image:
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=85",
        duration: "6N / 7D",
        pickup: "Jomo Kenyatta International Airport, Nairobi",
        drop: "Jomo Kenyatta International Airport, Nairobi",
        price: 195000,
        overview:
          "A premium Kenya safari through Masai Mara, Lake Naivasha, and Lake Nakuru in private 4x4 Land Cruisers. Witness the Big Five, enjoy bush dinners under starlit African skies, walk among giraffes at Crescent Island, and experience the raw beauty of the Great Rift Valley. Luxury tented camps and lodges throughout.",
        itinerary: [
          { day: 1, title: "Nairobi to Masai Mara", description: "Airport meet and greet. Drive through the Great Rift Valley to Masai Mara. Check into luxury tented camp. Afternoon nature walk with Maasai guide." },
          { day: 2, title: "Full Day Game Drive", description: "Full-day safari in Masai Mara with packed gourmet picnic lunch. Track lions, elephants, buffalo, leopards, and rhinos across the savannah." },
          { day: 3, title: "Big Five & Bush Dinner", description: "Second full-day game drive in a different sector. Optional Maasai village visit. Evening bush dinner experience under African stars." },
          { day: 4, title: "Lake Naivasha", description: "Drive to Lake Naivasha via the Great Rift Valley viewpoint. Boat ride on the lake. Walking safari at Crescent Island among free-roaming wildlife." },
          { day: 5, title: "Lake Nakuru Safari", description: "Full-day excursion to Lake Nakuru National Park. Spot white rhinos, flamingos, and Rothschild giraffes. Baboon Cliff panoramic views." },
          { day: 6, title: "Naivasha Leisure", description: "Morning at leisure. Optional hot air balloon ride. Afternoon cultural experience. Farewell dinner at the lodge." },
          { day: 7, title: "Departure", description: "Breakfast and drive to Nairobi airport with curio shop stops." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&w=900&q=85",
        ],
      },
      {
        id: "a2",
        title: "South Africa Premium Sojourn",
        image:
          "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?auto=format&fit=crop&w=900&q=85",
        duration: "7N / 8D",
        pickup: "Cape Town International Airport",
        drop: "OR Tambo International Airport, Johannesburg",
        price: 365000,
        overview:
          "The ultimate South African experience — from Cape Town's Table Mountain to Kruger's Big Five safaris. Includes Cape Peninsula drive, Stellenbosch wine country, Boulders Beach penguins, Cape of Good Hope, and multi-day Kruger safari in luxury lodges. A premium, life-changing adventure.",
        itinerary: [
          { day: 1, title: "Arrive Cape Town", description: "Airport transfer to luxury Cape Town hotel. Afternoon Table Mountain cable car ride. V&A Waterfront dinner." },
          { day: 2, title: "Cape Peninsula", description: "Full-day Cape Peninsula drive — Seal Island boat, Cape Point, Cape of Good Hope, Boulders Beach penguins. Sunset at Chapman's Peak." },
          { day: 3, title: "Wine Country", description: "Drive to Stellenbosch wine region. Private wine tasting at premium estates. Gourmet lunch among the vineyards." },
          { day: 4, title: "Fly to Kruger", description: "Morning flight to Kruger region. Check into luxury safari lodge. Afternoon game drive. Bush dinner." },
          { day: 5, title: "Kruger Safari Day 1", description: "Full-day open-vehicle safari. Track the Big Five with expert rangers. Sundowner drinks in the bush." },
          { day: 6, title: "Kruger Safari Day 2", description: "Sunrise game drive. Midday bush walk with armed ranger. Afternoon safari. Boma dinner under the stars." },
          { day: 7, title: "Johannesburg", description: "Morning transfer to Johannesburg. Apartheid Museum visit. Farewell dinner at a premium restaurant." },
          { day: 8, title: "Departure", description: "Breakfast and airport transfer." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=900&q=85",
        ],
      },
      {
        id: "a3",
        title: "Russia Northern Lights Expedition",
        image:
          "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=900&q=85",
        duration: "7N / 8D",
        pickup: "Sheremetyevo International Airport, Moscow",
        drop: "Sheremetyevo International Airport, Moscow",
        price: 340000,
        overview:
          "Chase the Aurora Borealis across Russia's Arctic frontier. From Moscow's Red Square to Murmansk's Kola Peninsula, experience igloo stays, Sami village visits, husky sledding, and the magical Northern Lights. End with St. Petersburg's imperial palaces and the high-speed Sapsan train.",
        itinerary: [
          { day: 1, title: "Arrive Moscow", description: "Airport transfer. Red Square, Kremlin exterior walk. Welcome dinner at a traditional Russian restaurant." },
          { day: 2, title: "Moscow to Murmansk", description: "Moscow Metro art tour. Afternoon flight to Murmansk. Check into Arctic lodge. Evening aurora hunting." },
          { day: 3, title: "Arctic Adventures", description: "Visit Sami village and reindeer herders. Husky sledding experience. Nuclear icebreaker Lenin museum. Night aurora hunting." },
          { day: 4, title: "Teriberka & Arctic Ocean", description: "Drive to Teriberka ghost village on the Arctic Ocean. Dramatic coastal landscapes. Stay in a heated igloo." },
          { day: 5, title: "Fly to St. Petersburg", description: "Morning flight to St. Petersburg. City walking tour — Nevsky Prospect, Church of the Savior on Spilled Blood. Canal boat cruise." },
          { day: 6, title: "Imperial St. Petersburg", description: "Hermitage Museum tour. Peter and Paul Fortress. Evening Russian ballet performance." },
          { day: 7, title: "Sapsan to Moscow", description: "Peterhof Palace and fountains. High-speed Sapsan train back to Moscow. Farewell dinner." },
          { day: 8, title: "Departure", description: "Breakfast and airport transfer." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1504699493508-24d15b41ef44?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&w=900&q=85",
        ],
      },
    ],
  },
  {
    id: "cultural",
    title: "Cultural Immersion",
    subtitle: "Stories Written in Stone",
    description:
      "Walk through millennia of human history. These luxury cultural journeys take you behind the scenes of the world's most fascinating civilizations — from Turkey's Ottoman grandeur to South Korea's autumn temples. Private guided tours, heritage stays, artisan workshops, and culinary deep-dives that go beyond the tourist trail.",
    bannerImage:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1800&q=85",
    trips: [
      {
        id: "c1",
        title: "Grand Turkey Heritage Trail",
        image:
          "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=85",
        duration: "8N / 9D",
        pickup: "Istanbul Airport",
        drop: "Istanbul Airport",
        price: 210000,
        overview:
          "A grand journey through Turkey's crossroads of civilizations. From Istanbul's Blue Mosque to Cappadocia's fairy chimneys, Pamukkale's cotton castles, and Antalya's Mediterranean charm. Includes optional hot air balloon ride, underground city explorations, and authentic Turkish hammam experiences.",
        itinerary: [
          { day: 1, title: "Arrive Istanbul", description: "Airport transfer. Bosphorus dinner cruise with stunning city skyline views." },
          { day: 2, title: "Historic Istanbul", description: "Blue Mosque, Hagia Sophia, Topkapi Palace, Grand Bazaar. Traditional Turkish dinner." },
          { day: 3, title: "Istanbul to Cappadocia", description: "Flight to Cappadocia. Goreme Open Air Museum. Sunset at Uchisar Castle." },
          { day: 4, title: "Cappadocia Valleys", description: "Optional hot air balloon at dawn. Underground city visit. Pottery workshop. Cave hotel evening." },
          { day: 5, title: "Cappadocia to Pamukkale", description: "Drive to Pamukkale. Visit the white travertine terraces and ancient Hierapolis ruins." },
          { day: 6, title: "Pamukkale to Antalya", description: "Morning at Pamukkale thermal pools. Drive to Antalya. Old Town walking tour." },
          { day: 7, title: "Antalya Explorer", description: "Duden Waterfalls, Hadrian's Gate, Kaleici. Turkish hammam experience." },
          { day: 8, title: "Return to Istanbul", description: "Flight to Istanbul. Spice Bazaar, Galata Tower. Farewell dinner on the Bosphorus." },
          { day: 9, title: "Departure", description: "Breakfast and airport transfer." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1589561454226-796a8c0e5348?auto=format&fit=crop&w=900&q=85",
        ],
      },
      {
        id: "c2",
        title: "Autumn Bliss in South Korea",
        image:
          "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=900&q=85",
        duration: "7N / 8D",
        pickup: "Incheon International Airport, Seoul",
        drop: "Incheon International Airport, Seoul",
        price: 335000,
        overview:
          "Experience South Korea during its most magical season — autumn. Golden ginkgo trees, crimson maples, and mountain temples create a living painting. From Seoul's vibrant nightlife and K-culture to Jeju's volcanic landscapes, Busan's coastal temples, and Nami Island's autumn wonderland. Travel by KTX bullet train.",
        itinerary: [
          { day: 1, title: "Arrive Seoul", description: "Airport transfer. Namsan Tower at sunset. Myeongdong street food tour." },
          { day: 2, title: "Seoul City", description: "Gyeongbokgung Palace in hanbok. Bukchon Hanok Village. Gangnam district. K-Pop experience." },
          { day: 3, title: "Fly to Jeju", description: "Flight to Jeju Island. Rail bike along the coast. O'Sulloc Tea Museum. Seongsan Ilchulbong sunset." },
          { day: 4, title: "Jeju Exploration", description: "Hallasan National Park autumn hike. Jeongbang Waterfall. Jeju local seafood dinner." },
          { day: 5, title: "Jeju to Busan", description: "Fly to Busan. Gamcheon Culture Village. Jagalchi Fish Market. Haeundae Beach sunset." },
          { day: 6, title: "Busan Temples", description: "Haedong Yonggungsa seaside temple. Songdo Cable Car. Korean BBQ farewell dinner." },
          { day: 7, title: "KTX to Seoul", description: "Bullet train to Seoul. Nami Island autumn walk. Evening at Cheonggyecheon Stream." },
          { day: 8, title: "Departure", description: "Morning shopping at Insadong. Airport transfer." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=85",
        ],
      },
      {
        id: "c3",
        title: "Georgia & Armenia Heritage Journey",
        image:
          "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=900&q=85",
        duration: "7N / 8D",
        pickup: "Tbilisi International Airport",
        drop: "Yerevan Zvartnots Airport",
        price: 128000,
        overview:
          "A journey through the Caucasus where ancient monasteries cling to cliffsides and wine flows from 8,000-year-old traditions. Explore Tbilisi's old town, drive the Georgian Military Highway, taste wines in Kakheti, discover Lake Sevan's blue waters, and stand before Armenia's Khor Virap with Mount Ararat as the backdrop.",
        itinerary: [
          { day: 1, title: "Arrive Tbilisi", description: "Airport transfer. Old Town walking tour — sulfur baths, Narikala Fortress, Bridge of Peace. Georgian feast welcome dinner." },
          { day: 2, title: "Georgian Military Highway", description: "Drive through the Caucasus to Ananuri Fortress. Gudauri panorama. Lunch with mountain views." },
          { day: 3, title: "Kakheti Wine Region", description: "Wine tasting at traditional qvevri cellars. Bodbe Monastery. Georgian bread-baking workshop." },
          { day: 4, title: "Tbilisi Free Day", description: "Explore Tbilisi at your pace. Dry Bridge flea market. Rustaveli Avenue. Evening rooftop dinner." },
          { day: 5, title: "Cross to Armenia", description: "Drive to Armenia via Haghpat Monastery (UNESCO). Arrive Yerevan. Evening Republic Square fountain show." },
          { day: 6, title: "Garni & Geghard", description: "Garni pagan temple. Geghard Monastery (UNESCO). Lavash baking experience. Armenian cognac tasting." },
          { day: 7, title: "Khor Virap & Noravank", description: "Khor Virap Monastery with Mount Ararat views. Noravank canyon and monastery. Farewell dinner with live duduk music." },
          { day: 8, title: "Departure", description: "Breakfast and transfer to Yerevan airport." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1504699493508-24d15b41ef44?auto=format&fit=crop&w=900&q=85",
        ],
      },
    ],
  },
  {
    id: "voyages",
    title: "Premium Voyages",
    subtitle: "Sail Beyond Horizons",
    description:
      "For travelers who seek the extraordinary. These premium voyages take you on river cruises through Europe's most storied waterways and boutique expeditions to hidden corners of Southeast Asia. White-glove service, gourmet dining, and destinations that most only dream about.",
    bannerImage:
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1800&q=85",
    trips: [
      {
        id: "v1",
        title: "Balkan River Cruise",
        image:
          "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=900&q=85",
        duration: "7N / 8D",
        pickup: "Budapest, Hungary",
        drop: "Bucharest, Romania",
        price: 465000,
        overview:
          "Cruise the Danube through five Balkan nations on a luxury river vessel. From Budapest's thermal baths to Belgrade's fortress, through the dramatic Iron Gates gorge to Bulgaria's folklore and Romania's capital. All meals, guided excursions, and evening entertainment included. This is river cruising at its finest.",
        itinerary: [
          { day: 1, title: "Budapest Embarkation", description: "Board the luxury river cruise ship. Welcome reception and Buda Castle views. Sail past the illuminated Parliament at night." },
          { day: 2, title: "Vukovar & Ilok, Croatia", description: "Guided walking tour of Vukovar. Wine tasting in Ilok, Croatia's oldest wine cellar. Evening cruise." },
          { day: 3, title: "Novi Sad, Serbia", description: "Explore Petrovaradin Fortress. Serbian cultural immersion. Evening entertainment on board." },
          { day: 4, title: "Belgrade, Serbia", description: "Belgrade city tour — Kalemegdan Fortress, Republic Square, Skadarlija bohemian quarter. Local dinner." },
          { day: 5, title: "Iron Gates Gorge", description: "Sail through the dramatic Iron Gates. Golubac Fortress views. Lepenski Vir archaeological stop." },
          { day: 6, title: "Vidin, Bulgaria", description: "Baba Vida Fortress. Drive to Belogradchik Rocks. Bulgarian folklore show with traditional dinner." },
          { day: 7, title: "Rousse to Bucharest", description: "Excursion to Veliko Tarnovo, medieval Bulgarian capital. Evening gala dinner on board." },
          { day: 8, title: "Disembarkation", description: "Breakfast and guided Bucharest city tour before airport transfer." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1504699493508-24d15b41ef44?auto=format&fit=crop&w=900&q=85",
        ],
      },
      {
        id: "v2",
        title: "Essence of Laos & Mekong",
        image:
          "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?auto=format&fit=crop&w=900&q=85",
        duration: "4N / 5D",
        pickup: "Luang Prabang Airport",
        drop: "Luang Prabang Airport",
        price: 68000,
        overview:
          "A boutique Laos escape centered around the UNESCO town of Luang Prabang. Cruise the Mekong to ancient Buddha caves, trek to Kuang Si turquoise waterfalls, witness the dawn alms-giving ceremony, and explore vibrant night markets. Stay in a heritage colonial boutique hotel with garden views. Intimate, unhurried, and deeply authentic.",
        itinerary: [
          { day: 1, title: "Arrive Luang Prabang", description: "Airport transfer to boutique hotel. Climb Phousi Hill for panoramic sunset views over the Mekong and Nam Khan rivers. Night market exploration." },
          { day: 2, title: "Temples & Heritage", description: "Visit Wat Xieng Thong and ancient temples. Royal Palace Museum. Traditional weaving village. Evening Laotian cooking class." },
          { day: 3, title: "Mekong River Cruise", description: "Cruise upstream to Pak Ou Buddha Caves. Visit riverside whiskey village. Picnic lunch on the riverbank. Afternoon at leisure." },
          { day: 4, title: "Kuang Si Waterfalls", description: "Morning alms-giving ceremony at dawn. Bear Rescue Centre visit. Swim in the turquoise pools of Kuang Si Falls. Farewell dinner." },
          { day: 5, title: "Departure", description: "Leisurely breakfast. Last-minute market shopping. Airport transfer." },
        ],
        gallery: [
          "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=900&q=85",
        ],
      },
    ],
  },
];
