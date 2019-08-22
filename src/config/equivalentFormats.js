/* --------------------------------------------
 * Formats that should be treated similarly
 */
export const formatsIndex = {
  json: ['topojson', 'geojson']
}

export const formatsList = Object.keys(formatsIndex).map(key => {
  return {name: key, equivalents: formatsIndex[key]}
})
