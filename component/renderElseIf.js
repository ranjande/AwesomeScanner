export default function renderElseIf(condition, content, altcontent) {
    if (condition) {
        return content;
    } else {
        return altcontent;
    }   
  }