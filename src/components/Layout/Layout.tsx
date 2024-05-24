import { ChangeEvent, PropsWithChildren, useCallback, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { FaGithub as FaGithubIcon } from "react-icons/fa";
import { DEFAULT_I18N_NAMESPACE, I18N_LOCALES } from "../../../constants";

function LanguageSwitch() {
  const { t: tCommon, i18n } = useTranslation(DEFAULT_I18N_NAMESPACE);
  const router = useRouter();
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const nextLocale = useRef<(typeof I18N_LOCALES)[number] | null>(
    i18n.language as unknown as (typeof I18N_LOCALES)[number]
  );
  const locales = I18N_LOCALES.map((l) => ({
    value: l,
    label: l.toUpperCase(),
  }));

  const handleLanguageSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      nextLocale.current = e.target
        .value as unknown as (typeof I18N_LOCALES)[number];

      openModal();
    },
    [openModal]
  );

  const handleLanguageChange = useCallback(() => {
    closeModal();

    if (!nextLocale.current) return;

    /* Avoid using i18n.changeLanguage because it does not persist the selected language on reload */
    router.push(router.asPath, undefined, {
      locale: nextLocale.current as string,
    });
  }, [closeModal, router]);

  const handleLanguageSwitchDismiss = useCallback(() => {
    closeModal();

    nextLocale.current = null;
  }, [closeModal]);

  return (
    <div className="flex flex-row items-center gap-2">
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          <ModalHeader>
            {tCommon("languageSwitch.confirmation.title")}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {tCommon("languageSwitch.confirmation.disclaimer")}
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {tCommon("languageSwitch.confirmation.question")}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              size="md"
              radius="sm"
              onPress={handleLanguageChange}
            >
              {tCommon("reload")}
            </Button>
            <Button
              variant="flat"
              size="md"
              radius="sm"
              onPress={handleLanguageSwitchDismiss}
            >
              {tCommon("cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Select
        items={locales}
        aria-label={tCommon("changeLanguage")}
        onChange={handleLanguageSelect}
        defaultSelectedKeys={[i18n.language]}
        selectedKeys={[i18n.language]}
        size="md"
        radius="sm"
        className="min-w-20"
        disabled
        isDisabled
      >
        {(locale) => <SelectItem key={locale.value}>{locale.label}</SelectItem>}
      </Select>
    </div>
  );
}

export default function Layout({ children }: PropsWithChildren) {
  const { t: tCommon } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tCommon("websiteTitleAbbr")}</title>
      </Head>

      <div className="flex min-h-[100svh] flex-col">
        <nav className="hide-on-print sticky top-0 z-10 mx-auto flex w-[120rem] max-w-full flex-row items-center justify-between border-b border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-950">
          <Link
            href={"/"}
            className="flex flex-row items-center gap-2 rounded text-sm font-bold text-slate-700 grayscale hover:text-black hover:no-underline hover:grayscale-0 focus:ring-0 focus:ring-offset-0 focus-visible:text-black focus-visible:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4 focus-visible:ring-offset-white focus-visible:grayscale-0 motion-safe:transition motion-safe:duration-300 dark:text-slate-300 dark:hover:text-white dark:focus-visible:text-white dark:focus-visible:ring-blue-500 focus-visible:dark:ring-offset-neutral-950"
          >
            <span aria-hidden>
              <Image
                src="/logo.svg"
                alt={tCommon("websiteTitle")}
                width={16}
                height={20}
                priority
              />
            </span>{" "}
            {tCommon("websiteTitleAbbr")}
          </Link>
          <aside className="flex flex-row items-center gap-2">
            <Button
              type="button"
              size="md"
              radius="full"
              variant="light"
              as={Link}
              href="https://github.com/n-d-r-d-g/k8s-env-converter"
              target="_blank"
              rel="noreferrer noopener nofollow"
              title={tCommon("githubLink")}
              aria-label={tCommon("githubLink")}
              passHref
              isIconOnly
            >
              <FaGithubIcon size={16} />
            </Button>
            <LanguageSwitch />
          </aside>
        </nav>
        <main className="root-container min-h-0 grow flex flex-col p-3">
          {children}
        </main>
        <footer className="hide-on-print grid place-content-center py-2">
          <Trans
            ns="common"
            i18nKey="websiteBuiltBy"
            components={{
              span: (
                <span className="text-center text-xs text-gray-700 dark:text-gray-400" />
              ),
              HeartTitle: (
                <span
                  title={tCommon("websiteBuiltByTitle")}
                  className="cursor-help"
                />
              ),
              GithubLink: (
                <Link
                  href="https://github.com/n-d-r-d-g"
                  target="_blank"
                  rel="noreferrer noopener nofollow"
                  className="rounded font-extrabold focus:ring-0 focus:ring-offset-0 focus-visible:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-500 focus-visible:dark:ring-offset-neutral-950"
                />
              ),
            }}
          />
        </footer>
      </div>
    </>
  );
}
