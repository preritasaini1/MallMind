import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/graphql';

export const fetchShoppingRecommendations = async (input) => {
  const query = `
    query Shop($input: String!) {
      shop(input: $input) {
        product
        color
        budget
        additional_request
        recommendations {
          store
          location
          product
          price
        }
        navigation {
          distance
          path
        }
      }
    }
  `;

  try {
    const response = await axios.post(API_URL, {
      query,
      variables: { input }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = response.data.data.shop;

    // Map backend response to UI StoreCard format
    let mappedStores = [];
    if (data.recommendations && data.recommendations.length > 0) {
      mappedStores = data.recommendations.map((rec, i) => ({
        id: i + 1,
        name: rec.store,
        category: rec.store === 'Blue Tokai' || rec.store === 'Cafe' || rec.store === 'Barista' ? 'Cafe' : 
                 rec.store === 'Nykaa Beauty' ? 'Beauty' : 
                 rec.store === 'Bata' || rec.store === 'Puma' ? 'Footwear' : 
                 rec.store === 'Blue stone' || rec.store === 'Mia' ? 'Jewellery' :
                 rec.store === 'Portico' || rec.store === 'Home Centre' || rec.store === 'Suvidha' || rec.store === 'Easybuy' ? 'Homedecor' :
                 rec.store === 'Croma' ? 'Electronics' :
                 rec.store === 'Safari' ? 'Travel' :
                 rec.store === 'Blaaze' || rec.store === 'Toyzone' || rec.store === 'Pixy Land' ? 'Playzone' : 'Clothing',
        floor: rec.location || 'F1',
        distance: data.navigation ? `${data.navigation.distance} min` : '5 min',
        price: `₹${rec.price}`,
        item: rec.product || 'Item',
        inStock: true,
        rating: 4.5,
        discount: null,
        color: '#1a3a5c', // default color
        icon: '🛍️' // default icon
      }));
    }

    let text = '';
    if (mappedStores.length > 0) {
      text = `Found **${mappedStores.length} matches** for you based on live stock!\n\n`;
      if (data.navigation && data.navigation.path) {
        text += `🗺 **Route:** ${data.navigation.path.join(' → ')}\n⏱ Total walk: ~${data.navigation.distance} minutes`;
      }
    } else {
      text = `I couldn't find any exact matches for your request right now. Would you like me to refine the search?`;
    }

    return {
      stores: mappedStores,
      text,
      rawIntent: data // optional, if we want to use the detected product/color in UI
    };

  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return {
      stores: [],
      text: "Sorry, I couldn't connect to the live inventory system right now. Please try again in a moment!"
    };
  }
};
