import React from 'react';
import {WorkspaceAccessGate} from '@workspace/ui/blocks/auth/workspace-access-gate';
import type {MainLayoutProps,TopMenuProps}from'@workspace/ui/layouts/main-layouts';
import{createPlatformBrowserClient}from'@workspace/sdk/platform-browser-client';
const client=createPlatformBrowserClient('fixture');
const main:Pick<MainLayoutProps,'launcherCatalogUrl'>={launcherCatalogUrl:undefined};
const menu:Pick<TopMenuProps,'launcherCatalogUrl'>={launcherCatalogUrl:'/platform-api/v1/landing'};
export const gate=<WorkspaceAccessGate client={client} brandName="Fixture">{session=><p>{session.user.displayName}</p>}</WorkspaceAccessGate>;
export{main,menu};
