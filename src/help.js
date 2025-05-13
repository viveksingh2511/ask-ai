export function Heading(string){
    return /^(\*)(\*)(.*)\*$/.test(string) //regex
}

export function removeHeadingStars(string){
    return string.replace(/^(\*)(\*)|(\*)$/g,'') //regex
}