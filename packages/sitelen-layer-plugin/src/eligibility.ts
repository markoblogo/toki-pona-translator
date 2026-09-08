export function resolveEligibility(passThreshold: boolean, requireDominantTokiPona: boolean): boolean {
  return requireDominantTokiPona ? passThreshold : true;
}
