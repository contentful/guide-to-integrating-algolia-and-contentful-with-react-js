export const Facet = ({ facetFieldKey, facetFieldOptions, onChange }) => {
  const sanitizedFacetTitle = facetFieldKey.match(/(?<=fields.)[A-Za-z]+(?=.en-US)/)[0]

  return (
    <div>
      <span className="facet-title">{sanitizedFacetTitle.toUpperCase()}</span>
      <div className="facet-options">
        {Object.entries(facetFieldOptions).map(([facetLabel, facetQty], idx) => {
          const inputId = `input-${facetLabel}-${idx}`
          return (
            <div className="facet-option" key={`${facetLabel}-${idx}`}>
              <input
                id={inputId}
                type="checkbox"
                onChange={(e) => {
                  onChange(facetFieldKey, e.target.value)
                }}
                value={facetLabel}
              />
              <label htmlFor={inputId}>
                {facetLabel} ({facetQty})
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
