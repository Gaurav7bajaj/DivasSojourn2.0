import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Destination-correct covers that return HTTP 200 on Unsplash.
 * Replaces broken 404 URLs, shared wrong temples, and local /uploads that
 * fail on many hosts.
 */
const FIXES = {
  "sri-lanka-soul-2027": {
    image:
      "https://images.unsplash.com/photo-1653959699604-1eb000740b57?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1653959699604-1eb000740b57?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=85",
    ],
  },
  "rameshwaram-spiritual-gateway": {
    image:
      "https://images.unsplash.com/photo-1572146462570-2129a547e6dd?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1572146462570-2129a547e6dd?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=900&q=85",
    ],
  },
  "jyotirlingas-ellora-divine-historic-odyssey": {
    image:
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=900&q=85",
    ],
  },
  "jagannath-puri-2027": {
    image:
      "https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
    ],
  },
  "rann-of-kutch-2027": {
    image:
      "https://images.unsplash.com/photo-1706013698821-3f417f9fcc0b?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1706013698821-3f417f9fcc0b?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=900&q=85",
    ],
  },
  "pondicherry-mahabalipuram-2027": {
    image:
      "https://images.unsplash.com/photo-1624257146471-78ea613e1649?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1624257146471-78ea613e1649?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
    ],
  },
  "guwahati-shillong-cherrapunji-2027": {
    image:
      "https://images.unsplash.com/photo-1723651973403-a262cfd9db0f?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1723651973403-a262cfd9db0f?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    ],
  },
  "tawang-dirang-2027": {
    image:
      "https://images.unsplash.com/photo-1626761627604-f27d98885f4b?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1626761627604-f27d98885f4b?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    ],
  },
  "varanasi-prayagraj-ayodhya-2027": {
    image:
      "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=85",
    ],
  },
  // Same wrong shared temple URL as Rameshwaram/Jagannath — give Ujjain its own cover
  "ujjain-2027": {
    image:
      "https://images.unsplash.com/photo-1658730458768-8b8cc0c00955?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1658730458768-8b8cc0c00955?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=85",
    ],
  },
};

async function main() {
  for (const [slug, data] of Object.entries(FIXES)) {
    const trip = await prisma.trip.findUnique({ where: { slug } });
    if (!trip) {
      console.log("MISS", slug);
      continue;
    }
    await prisma.trip.update({
      where: { slug },
      data: {
        image: data.image,
        galleryImages: data.galleryImages,
      },
    });
    console.log("OK", slug, "->", data.image.slice(0, 70));
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
