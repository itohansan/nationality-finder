import fetch from "node-fetch";

const resolvers = {
  Query: {
    async getNationality(_, { name }) {
      //   console.log("getNationality called with:", name);

      // Normalize input
      const normalize = (str) =>
        str
          .toLowerCase()
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

      const normalized = normalize(name);

      // Remove common job titles
      let cleanedName = normalized
        .replace(
          /\b(singer|artist|rapper|musician|actor|actress|player|footballer|dj|producer|celeb)\b/g,
          ""
        )
        .trim();

      //   console.log(`Input: "${name}"  cleaned: "${cleanedName}"`);

      // Quick cache (instant rich results)
      const quickCache = {
        rema: {
          name: "Rema",
          nationality: "NG",
          fullName: "Divine Ikubor",
          age: 25,
          occupation: ["Singer", "Rapper", "Songwriter"],
          photo:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Rema_at_2019_LFW_%28cropped%29.png/640px-Rema_at_2019_LFW_%28cropped%29.png",
          bio: "Nigerian Afrobeats superstar known for 'Calm Down' and global hits.",
        },
        wizkid: {
          name: "Wizkid",
          nationality: "NG",
          fullName: "Ayodeji Ibrahim Balogun",
          age: 34,
          occupation: ["Singer", "Songwriter"],
          photo:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Wizkid_at_Iyanya%27s_album_launch_concert%2C_2013.jpg/640px-Wizkid_at_Iyanya%27s_album_launch_concert%2C_2013.jpg",
          bio: "Nigerian music icon and pioneer of Afrobeats worldwide.",
        },
        tems: {
          name: "Tems",
          nationality: "NG",
          fullName: "Temilade Openiyi",
          age: 29,
          occupation: ["Singer", "Songwriter"],
          photo:
            "https://upload.wikimedia.org/wikipedia/commons/e/ec/Tems_on_NdaniTV_Sessions_-cropped.png",
          bio: "Nigerian alté/R&B singer famous for 'Essence' with Wizkid.",
        },
      };

      if (quickCache[cleanedName]) {
        // console.log("Quick cache hit!");
        return quickCache[cleanedName];
      }

      // Smart name corrections
      const nameCorrections = {
        "the weekend": "the weeknd",
        weeknd: "the weeknd",
        "abel tesfaye": "the weeknd",
        beyonce: "beyoncé",
        "post malone": "post malone",
        "billie eilish": "billie eilish",
        "ariana grande": "ariana grande",
        "justin bieber": "justin bieber",
        "ed sheeran": "ed sheeran",
        "taylor swift": "taylor swift",
        "elon musk": "elon musk",
      };

      let searchName = nameCorrections[cleanedName] || cleanedName;
      //   console.log("Final search name →", searchName);

      // 1 API-NINJAS (Best source)
      try {
        // console.log("Searching API Ninjas...");
        const apiKey = process.env.API_NINJAS_KEY;

        if (!apiKey) throw new Error("API key missing");

        const response = await fetch(
          `https://api.api-ninjas.com/v1/celebrity?name=${encodeURIComponent(
            searchName
          )}`,
          { headers: { "X-Api-Key": apiKey } }
        );

        if (response.ok) {
          const data = await response.json();
          //   console.log("API Ninjas response:", data);

          if (data?.length > 0) {
            let celeb = data[0];

            // Prefer musicians if query suggests music
            if (name.match(/sing|music|rap|dj|artist/i)) {
              const musician = data.find((c) =>
                c.occupation?.some((o) =>
                  /singer|musician|rapper|dj|artist/i.test(o)
                )
              );
              if (musician) celeb = musician;
            }

            const nationality = celeb.nationality?.toUpperCase();

            if (nationality) {
              const occupations = (celeb.occupation || [])
                .map((o) =>
                  o
                    .split("_")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")
                )
                .filter((o) => !o.toLowerCase().includes("porn"));

              // Get photo from Wikipedia
              // GET PHOTO FROM WIKIPEDIA (FIXED)
              let photoUrl = null;
              try {
                const properTitle = celeb.name
                  .toLowerCase()
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");

                // console.log("Searching Wikipedia photo for:", properTitle);

                const wikiRes = await fetch(
                  `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(
                    properTitle
                  )}&origin=*`
                );
                const wikiData = await wikiRes.json();
                const page = Object.values(wikiData.query.pages)[0];
                if (page?.original?.source) {
                  photoUrl = page.original.source;
                  console.log("PHOTO FOUND:", photoUrl);
                } else {
                  console.log("No photo on Wikipedia page");
                }
              } catch (e) {
                console.log("Wikipedia photo fetch failed");
              }

              return {
                name,
                nationality,
                fullName: celeb.name,
                age: celeb.age || null,
                occupation: occupations,
                photo: photoUrl,
                bio: `${celeb.name} is known for ${
                  occupations[0] || "their work in entertainment"
                }.`,
              };
            }
          }
        }
      } catch (err) {
        console.error("API Ninjas failed:", err.message);
      }

      // 2. MusicBrainz fallback
      try {
        // console.log("Trying MusicBrainz...");
        const mbRes = await fetch(
          `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(
            searchName
          )}&fmt=json&limit=3`,
          { headers: { "User-Agent": "NationalityApp/1.0" } }
        );
        if (mbRes.ok) {
          const mbData = await mbRes.json();
          if (mbData.artists?.length > 0) {
            const artist = mbData.artists[0];
            if (artist.country) {
              let age = null;
              if (artist["life-span"]?.begin) {
                age =
                  new Date().getFullYear() -
                  parseInt(artist["life-span"].begin);
              }
              return {
                name,
                nationality: artist.country,
                fullName: artist.name,
                age,
                occupation: ["Musician", "Artist"],
                photo: null,
                bio: artist.disambiguation || null,
              };
            }
          }
        }
      } catch (err) {
        console.error("MusicBrainz failed");
      }

      // 3 Final fallback: Nationalize.io
      try {
        const res = await fetch(
          `https://api.nationalize.io/?name=${encodeURIComponent(
            name.split(" ")[0]
          )}`
        );
        const data = await res.json();
        if (data.country?.[0]) {
          return {
            name,
            nationality: data.country[0].country_id,
            fullName: null,
            age: null,
            occupation: [],
            photo: null,
            bio: null,
          };
        }
      } catch (err) {
        console.error("Nationalize.io failed");
      }

      // Unknown
      return {
        name,
        nationality: "Unknown",
        fullName: null,
        age: null,
        occupation: [],
        photo: null,
        bio: null,
      };
    },
  },
};

export default resolvers;
