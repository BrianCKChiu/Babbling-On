// // Function returns a tuple : (success, result)
// async function imageAnalyzer(imageURL: string, currentLetter: string): Promise<[boolean, boolean]> {
//   try {
//     if (!imageURL) {
//       return [false, false];
//     }

//     const response = await fetch('http://localhost:8080/ai/analyze-image', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ image_url: imageURL }),
//     });

//     if (!response.ok) {
//       throw new Error(`There was an error: ${response.status}`);
//     }

//     const responseData = await response.json();
    
//     console.log(`Recognised Alphabet: ${responseData.prediction}`)
//     return [true, responseData.prediction === currentLetter];
//   } catch (error: any) {
//     console.error('Error:', error.message);
//     return [false, false];
//   }
// }

// export default imageAnalyzer;

//VERSION 2:
// Function returns a tuple: (success, result)
async function imageAnalyzer(imageURL: string, currentLetter: string): Promise<[boolean, boolean, string]> {
  try {
    if (!imageURL) {
      return [false, false, ''];
    }

    const response = await fetch('http://localhost:8080/image/detect', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_url: imageURL }),
    });

    if (!response.ok) {
      throw new Error(`There was an error: ${response.status}`);
    }

    const responseData = await response.json();

    // Extracting the "class" value from the first prediction
    const predictedAlphabet = responseData.predictions.length > 0 ? responseData.predictions[0].class : '';

    console.log(`Recognized Alphabet: ${predictedAlphabet}`);
    return [true, predictedAlphabet === currentLetter, predictedAlphabet];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error:', error.message);
    return [false, false, ''];
  }
}

export default imageAnalyzer;
