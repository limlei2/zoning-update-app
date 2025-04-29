// Function to make strings into Title Case
export function toTitleCase(str) {
    if (!str) return '';
    return str.toLowerCase().split(/(\s|-|\/)/).map(word => {
      if (word.match(/\s|-|\//)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
}