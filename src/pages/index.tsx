import { GetStaticProps } from "next";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import YAML from "yaml";
import { Snippets } from "@/components/Snippets/Snippets";
import { DEFAULT_I18N_LOCALE, DEFAULT_I18N_NAMESPACE } from "../../constants";
import { EnvVarSnippet, K8sContainer, K8sSpec } from "@/types";

export default function Home() {
  const { t: tCommon } = useTranslation(DEFAULT_I18N_NAMESPACE);
  const [envVarSnippets, setEnvVarSnippets] = useState<Array<EnvVarSnippet>>(
    []
  );
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const modalContent = useRef({
    header: tCommon("error"),
    body: tCommon("errors.fileUpload.unexpected"),
  });

  const handleDropAbort = useCallback(
    () => console.log("File reading was aborted"),
    []
  );

  const handleDropError = useCallback(
    () => console.log("File reading has failed"),
    []
  );

  const handleFileLoad = useCallback(
    (fileReader: FileReader) => () => {
      const fileContent = fileReader.result;

      if (typeof fileContent === "string") {
        const parsedContent = YAML.parse(fileContent) as K8sSpec;

        const containerEnvVarSnippets: Array<EnvVarSnippet> = (
          parsedContent.spec?.containers ?? []
        ).map((container: K8sContainer) => ({
          type: "container",
          name: container.name || "-",
          envVars: (container?.env ?? []).map(
            (yamlEnvVar: any) => `${yamlEnvVar.name}=${yamlEnvVar.value}`
          ),
        }));

        const ephemeralContainerEnvVarSnippets: Array<EnvVarSnippet> = (
          parsedContent.spec?.ephemeralContainers ?? []
        ).map((container: K8sContainer) => ({
          type: "ephemeralContainer",
          name: container.name || "-",
          envVars: (container?.env ?? []).map(
            (yamlEnvVar: any) => `${yamlEnvVar.name}=${yamlEnvVar.value}`
          ),
        }));

        const initContainerEnvVarSnippets: Array<EnvVarSnippet> = (
          parsedContent.spec?.initContainers ?? []
        ).map((container: K8sContainer) => ({
          type: "initContainer",
          name: container.name || "-",
          envVars: (container?.env ?? []).map(
            (yamlEnvVar: any) => `${yamlEnvVar.name}=${yamlEnvVar.value}`
          ),
        }));

        const newEnvVarSnippets = [
          ...containerEnvVarSnippets,
          ...ephemeralContainerEnvVarSnippets,
          ...initContainerEnvVarSnippets,
        ];

        return setEnvVarSnippets(newEnvVarSnippets);
      }

      modalContent.current = {
        header: modalContent.current.header,
        body: tCommon("errors.fileUpload.unexpected"),
      };

      openModal();
    },
    [openModal, tCommon]
  );

  const onDropAccepted = useCallback(
    (acceptedFiles: Array<File>) => {
      const file = acceptedFiles[0];
      const fileReader = new FileReader();

      fileReader.onabort = handleDropAbort;
      fileReader.onerror = handleDropError;
      fileReader.onload = handleFileLoad(fileReader);
      fileReader.readAsText(file);
    },
    [handleDropAbort, handleDropError, handleFileLoad]
  );

  const onDropRejected = useCallback(() => {
    modalContent.current = {
      header: modalContent.current.header,
      body: tCommon("errors.fileUpload.dropRejected"),
    };

    openModal();
  }, [openModal, tCommon]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: { "text/yaml": [".yaml", ".yml"] },
    onDropAccepted,
    onDropRejected,
  });

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onOpenChange={openModal}
        onClose={closeModal}
        radius="sm"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {modalContent.current.header}
          </ModalHeader>
          <ModalBody>
            <p>{modalContent.current.body}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              variant="flat"
              radius="sm"
              onPress={closeModal}
              className="text-primary-700"
            >
              {tCommon("ok")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <input {...getInputProps()} />
      <h1>{tCommon("websiteTitle")}</h1>
      <p className="text-center one-col-text">
        {tCommon("websiteDescription")}
      </p>
      <section
        {...getRootProps()}
        className={`grow flex flex-row justify-center items-start mt-8 px-2 py-2 sm:py-4 mb-8 cursor-pointer rounded-lg border-4 border-dashed ${
          isDragActive
            ? "bg-success-500 border-success-50"
            : "border-default-500"
        }`}
      >
        <Snippets values={envVarSnippets} showEmptyState={isDragActive} />
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_I18N_LOCALE, [
        DEFAULT_I18N_NAMESPACE,
      ])),
    },
  };
};
