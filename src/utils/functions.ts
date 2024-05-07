export function retrieveNestedSpec(
  specObject: undefined | { template?: { spec?: any } }
) {
  if (!specObject) return specObject;

  const specObjContainsNestedSpec = Object.keys(specObject ?? {}).includes(
    "template"
  );

  if (specObjContainsNestedSpec)
    return retrieveNestedSpec(specObject.template?.spec);

  return specObject;
}
