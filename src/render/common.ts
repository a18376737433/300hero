export const closeLoading = (id:string) => {
  const appLoading = document.getElementById(id)
  if (appLoading) appLoading.style.display = 'none'
}
