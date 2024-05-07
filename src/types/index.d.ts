import { I18N_LOCALES } from "../../constants";

type I18nLocale = (typeof I18N_LOCALES)[number];

type K8sEnvVar = {
  name?: string;
  value?: string;
};

type K8sContainer = {
  name?: string;
  env?: Array<K8SEnvVar>;
};

interface K8sSpec {
  spec?: {
    containers?: Array<K8sContainer>;
    ephemeralContainers?: Array<K8sContainer>;
    initContainers?: Array<K8sContainer>;
  };
}

interface EnvVarSnippet {
  type: "container" | "ephemeralContainer" | "initContainer";
  name: string;
  envVars: Array<string>;
}
