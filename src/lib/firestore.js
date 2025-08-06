import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Save diagnosis to Firestore
export const saveDiagnosis = async (userId, diagnosisData) => {
  try {
    const docRef = await addDoc(collection(db, 'diagnoses'), {
      userId,
      symptoms: diagnosisData.symptoms,
      diagnoses: diagnosisData.diagnoses,
      riskLevel: diagnosisData.riskLevel,
      recommendations: diagnosisData.recommendations,
      confidenceScore: diagnosisData.confidenceScore,
      timestamp: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Fetch diagnosis history for a user
export const getDiagnosisHistory = async (userId) => {
  try {
      const q = query(
    collection(db, 'diagnoses'),
    where('userId', '==', userId)
    // Removed orderBy to avoid index requirement
  );
    
    const querySnapshot = await getDocs(q);
    const diagnoses = [];
    
    querySnapshot.forEach((doc) => {
      diagnoses.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      });
    });
    
    // Sort by timestamp in descending order (newest first)
    diagnoses.sort((a, b) => {
      if (!a.timestamp || !b.timestamp) return 0;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
    
    return { success: true, diagnoses };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 