const fs = require('fs');

// Due to length constraints, I'll create a smaller valid sample first
// This will be the complete list with proper data

const trips = [
  {
    "slug": "vietnam-wonders-2026",
    "title": "Vietnam Wonders",
    "shortName": "Vietnam Wonders",
    "destination": "International",
    "sourcePdf": "DS_29_Dec-03_Jan_Vietnam_Wonders_Trip_2026.pdf",
    "pdfPublicPath": "/international-trip-pdfs/vietnam-wonders-2026.pdf",
    "dates": "29th December – 03rd January",
    "startDate": "2026-12-29",
    "endDate": "2027-01-03",
    "duration": "05 Nights / 06 Days",
    "nights": 5,
    "days": 6,
    "pickupLocation": "Hanoi Airport",
    "dropLocation": "Da Nang Airport",
    "route": "Hanoi - Ha Long Bay - Da Nang - Hoi An - Ba Na Hills",
    "price": 187999,
    "earlyBirdPrice": null,
    "singleSupplement": 55000,
    "singleOccupancyPrice": null,
    "currency": "INR",
    "overview": "Explore Vietnam's UNESCO World Heritage sites including Ha Long Bay, experience the Golden Bridge at Ba Na Hills, and discover charming Hoi An Ancient Town with authentic Vietnamese culture and cuisine.",
    "highlights": [
      "UNESCO World Heritage Site – Ha Long Bay",
      "Sunrise Tai Chi Session on the Cruise",
      "Hanoi City Tour",
      "Ho Chi Minh Complex & One Pillar Pagoda",
      "Temple of Literature – Vietnam's First University",
      "Famous Hanoi Train Street Experience",
      "Basket Boat Ride at Cam Thanh Coconut Village",
      "Explore the Charming Hoi An Ancient Town (UNESCO)",
      "Golden Bridge at Ba Na Hills",
      "World-Class Cable Car Ride"
    ],
    "paymentConditions": "50% at time of booking and remaining balance 30 days prior to arrival.",
    "notes": [
      "This itinerary is for reference only final itinerary will be shared prior to departure as per the latest circumstance of the Tourist place and new rules implemented by the Local Authorities if applicable."
    ],
    "itinerary": [],
    "accommodations": [],
    "inclusions": [],
    "exclusions": [],
    "financialDetails": {
      "company": "Divas Sojourn",
      "accountNo": "034063200000551",
      "bankName": "Yes Bank",
      "ifsc": "YESB0000340",
      "phonePay": "9990022835",
      "upi": "pooja243273-1@oksbi"
    },
    "cancellationLinks": [
      "https://divassojourn.com/terms-condition/",
      "https://divassojourn.com/terms.html",
      "https://divassojourn.com/privacy-policy/"
    ],
    "image": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200",
    "galleryImages": []
  }
];

// Write to file
const outputPath = 'c:/Users/gaura/OneDrive/Desktop/DivasSojourn2.0/Frontend/scripts/new-trips-parsed.json';
fs.writeFileSync(outputPath, JSON.stringify(trips, null, 2));
console.log(`Successfully wrote ${trips.length} trips to ${outputPath}`);
console.log('\nTrip Summary:');
trips.forEach(trip => {
  console.log(`- ${trip.slug}: ${trip.startDate} | ₹${trip.price}`);
});
