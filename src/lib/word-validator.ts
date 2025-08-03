// Word validation using Free Dictionary API
// https://api.dictionaryapi.dev/api/v2/entries/en/

interface DictionaryResponse {
  word: string;
  phonetic?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
}

// Cache for API responses to avoid repeated calls
const wordCache = new Map<string, boolean>();

// Generate all possible anagrams of a word
const generateAnagrams = (word: string): string[] => {
  if (word.length <= 1) return [word];
  
  const anagrams: string[] = [];
  
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const remainingChars = word.slice(0, i) + word.slice(i + 1);
    const subAnagrams = generateAnagrams(remainingChars);
    
    for (const subAnagram of subAnagrams) {
      anagrams.push(char + subAnagram);
    }
  }
  
  return [...new Set(anagrams)]; // Remove duplicates
};

// Check if a word exists using the Free Dictionary API
const checkWordExists = async (word: string): Promise<boolean> => {
  // Check cache first
  if (wordCache.has(word)) {
    return wordCache.get(word)!;
  }
  
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    
    if (response.ok) {
      const data: DictionaryResponse[] = await response.json();
      const isValid = data.length > 0;
      
      // Cache the result
      wordCache.set(word, isValid);
      return isValid;
    } else {
      // Word not found
      wordCache.set(word, false);
      return false;
    }
  } catch (error) {
    console.error(`Error checking word "${word}":`, error);
    // On error, assume word is invalid to be safe
    wordCache.set(word, false);
    return false;
  }
};

// Get all valid anagrams of a word
export const getValidAnagrams = async (word: string): Promise<string[]> => {
  const allAnagrams = generateAnagrams(word);
  const validAnagrams: string[] = [];
  
  // Check each anagram against the API
  for (const anagram of allAnagrams) {
    if (anagram !== word && await checkWordExists(anagram)) {
      validAnagrams.push(anagram);
    }
  }
  
  return validAnagrams;
};

// Check if a user's word is a valid anagram of the target word
export const isValidAnagram = async (userWord: string, targetWord: string): Promise<boolean> => {
  // First check if they're the same length
  if (userWord.length !== targetWord.length) return false;
  
  // Check if they use the same letters (are anagrams)
  const sortedUser = userWord.toLowerCase().split('').sort().join('');
  const sortedTarget = targetWord.toLowerCase().split('').sort().join('');
  
  if (sortedUser !== sortedTarget) return false;
  
  // Check if the user's word is a valid word
  return await checkWordExists(userWord);
};

// Preload common anagrams for better performance
export const preloadCommonAnagrams = async (): Promise<void> => {
  const commonWords = ['CAT', 'DOG', 'HAT', 'RUN', 'SUN', 'BIG', 'RED', 'BLUE', 'GREEN', 'BOOK'];
  
  for (const word of commonWords) {
    await getValidAnagrams(word);
  }
  
  console.log('Common anagrams preloaded');
};

// Clear cache (useful for testing or memory management)
export const clearWordCache = (): void => {
  wordCache.clear();
};

// Get cache stats
export const getCacheStats = (): { size: number; entries: string[] } => {
  return {
    size: wordCache.size,
    entries: Array.from(wordCache.keys())
  };
}; 