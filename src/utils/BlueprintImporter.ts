import fs from "fs";
import { Feature } from "./BlueprintBrowser";
import { Blueprint } from "./BlueprintBrowser";

const BLUEPRINT_ROOT = "./Blueprints/";
const EXPORT_ROOT = "./BlueprintExports/";
const EXPORT_FILE = "featureList.json";

function importBlueprints(filepath: string) {
  const blueprints = fs
    .readdirSync(filepath)
    .map((f) => JSON.parse(f) as Blueprint);
}
function writeBlueprints(featureList: Feature[]) {
  fs.writeFile(
    `${EXPORT_ROOT}/${EXPORT_FILE}`,
    JSON.stringify(
      featureList.reduce((acc, feat) => {
        return { ...acc, [feat.id]: feat };
      }, {})
    ),
    (err) => {
      if (err) {
        console.error("file write failed: ", err);
      }
    }
  );
}

function importFeatureProgression() {
  const progs = importBlueprints(
    `${BLUEPRINT_ROOT}Kingmaker.Blueprints.Classes.BlueprintProgression`
  );
  return progs;
}
function importClassProgression() {
  const progs = importBlueprints(
    `${BLUEPRINT_ROOT}Kingmaker.Blueprints.Classes.BlueprintStatProgression`
  );
  return progs;
}
