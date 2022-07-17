export const getErrorMessage = (errorMessage: string) => {
  if (errorMessage.includes("reverted with reason string '")) {
    const reverseMessageIndex = errorMessage.indexOf(
      'reverted with reason string ',
    )
    const startIndexError =
      errorMessage.substring(reverseMessageIndex).indexOf("'") +
      reverseMessageIndex +
      1
    const lastIndexError = errorMessage.indexOf('\'", method')
    if (startIndexError && lastIndexError) {
      return errorMessage.substring(startIndexError, lastIndexError)
    } else {
      return ''
    }
  } else {
    return ''
  }
}
