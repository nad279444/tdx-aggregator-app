import { Dimensions } from 'react-native';

// Function to calculate the diagonal length of the screen in inches
export const screenDiagonal = (): number => {
    // Get the screen dimensions
    const { width, height } = Dimensions.get('screen');

    // Calculate the diagonal length using the Pythagorean theorem
    const diagonalPixels = Math.sqrt(width ** 2 + height ** 2);
    
    // Assuming a standard pixel density of 160 DPI (dots per inch)
    const dpi = 160;

    // Calculate the diagonal length in inches
    const diagonalInches = diagonalPixels / dpi;

    return diagonalInches;
};