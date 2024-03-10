
export function formatToTwoDigits(number: number) {
    let formatedNum = number.toString()
    if(formatedNum.length < 2) {
      formatedNum = '0' + formatedNum
      return formatedNum
    }

    return number
  }
