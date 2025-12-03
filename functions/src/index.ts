import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Note: This file is for the Firebase Cloud Functions backend.
// You must deploy this using "firebase deploy --only functions".
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

// --- 1. AI Generation (Vertex AI / Gemini) ---
export const generateScenario = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  const { photoId, prompt, agencyId } = data;

  // A. Fetch Agency Settings (API Key)
  const agencyDoc = await db.collection('agencies').doc(agencyId).get();
  if (!agencyDoc.exists) throw new functions.https.HttpsError('not-found', 'Agency not found.');
  const { googleApiKey, usageCount, usageLimit } = agencyDoc.data() || {};

  // B. Throttling Check
  if (usageCount > (usageLimit || 100)) {
    throw new functions.https.HttpsError('resource-exhausted', 'Agency AI limit reached. Try again later.');
  }

  try {
    // C. Call Vertex AI (Simplified)
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${googleApiKey}`;
    
    // In a real app, you would post the image data here. 
    // For this skeleton, we are simulating the successful response.
    /* const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: `Transform this image: ${prompt}` }] }] 
    });
    */

    // D. Return Mock Result (until real key is connected)
    const resultUrl = "https://source.unsplash.com/random/800x600/?scifi";

    // Update Usage
    await db.collection('agencies').doc(agencyId).update({
      usageCount: admin.firestore.FieldValue.increment(1)
    });

    return { success: true, url: resultUrl };

  } catch (error: any) {
    console.error("AI Gen Error", error);
    throw new functions.https.HttpsError('internal', 'AI Generation Failed', error.message);
  }
});

// --- 2. Stripe Webhook (Fulfillment) ---
export const fulfillOrder = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = req.body; // In prod, verify signature using stripe.webhooks.constructEvent

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { agencyId, customerEmail, customerName, cartItems } = session.metadata;

    // A. Create Album/Receipt Record
    const albumId = admin.firestore().collection('purchased_albums').doc().id;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 Days

    // B. Trigger GoHighLevel Webhook (if configured)
    const agencyDoc = await db.collection('agencies').doc(agencyId).get();
    const { ghlWebhookUrl } = agencyDoc.data() || {};

    if (ghlWebhookUrl) {
      try {
        await axios.post(ghlWebhookUrl, {
          event: "purchase_success",
          contact_email: customerEmail,
          contact_name: customerName,
          download_url: `https://magicmoments.ai/download/${albumId}`,
          expiry_date: expiryDate.toISOString()
        });
      } catch (e) {
        console.error("GHL Webhook Failed", e);
      }
    }

    // C. Save Purchase Record
    await db.collection('purchased_albums').doc(albumId).set({
      email: customerEmail,
      items: JSON.parse(cartItems),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: expiryDate,
      status: 'active'
    });
  }
  res.json({received: true});
});

// --- 3. Cleanup Cron Job (Daily) ---
export const cleanupStorage = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const now = new Date();
  // 1. Query expired albums
  const snapshot = await db.collection('purchased_albums').where('expiresAt', '<', now).get();
  
  const promises = snapshot.docs.map(async (doc) => {
    // await bucket.file(`high_res/${doc.id}`).delete(); // Real deletion logic
    await doc.ref.delete(); // Delete DB record
  });
  
  await Promise.all(promises);
  console.log(`Cleaned up ${snapshot.size} expired albums.`);
  return null;
});