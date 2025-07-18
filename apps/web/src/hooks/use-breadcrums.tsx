import { useEffect } from "react";
import { useNavStore } from '@/stores/nav.store';
import { moduleConfig } from '@/config/moduleConfig';

type ModuleKey = keyof typeof moduleConfig;
type RouteType = 'list' | 'view' | 'create' | 'edit';

interface UseBreadcrumbsOptions {
  module: ModuleKey;
  type: RouteType;
  id?: string | number;
  name?: string;
}

export const useBreadcrumbs = ({ module, type, id, name }: UseBreadcrumbsOptions) => {
  const { setBreadcrumbs, setTitle } = useNavStore();
  const moduleData = moduleConfig[module];

  useEffect(() => {
    if (!moduleData?.routes) return;

    const route = moduleData.routes[type];
    if (!route?.breadcrumbs) return;

    let breadcrumbs = [...route.breadcrumbs];


    const pageTitle = moduleData.routes[type]?.title || moduleData.name;

    if (id && (type === 'view' || type === 'edit')) {
      const displayName = name
        ? `${name} #${id}`
        : `${moduleData.prefix || module}-#${id}`;

      breadcrumbs[breadcrumbs.length - 1] = {
        ...breadcrumbs[breadcrumbs.length - 1],
        label: displayName
      };


      setTitle(displayName);
    } else {

      setTitle(pageTitle);
    }

    setBreadcrumbs(breadcrumbs);
  }, [module, type, id, name, setBreadcrumbs, setTitle]);

  return {
    title: moduleData?.routes[type]?.title || '',
    baseUrl: moduleData?.baseUrl || ''
  };
};  
