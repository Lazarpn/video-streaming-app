// Referenced from https://github.com/moff/angular2-ladda/blob/master/projects/ladda/src/lib/ladda.module.ts
import { ModuleWithProviders, NgModule } from '@angular/core';

import { LaddaConfig, LaddaConfigArgs } from './ladda-config';
import { LaddaDirective } from './ladda.directive';

@NgModule({
  declarations: [LaddaDirective],
  exports: [LaddaDirective],
})
export class LaddaModule {
  public static forRoot(config: LaddaConfigArgs): ModuleWithProviders<LaddaModule> {
    return {
      ngModule: LaddaModule,
      providers: [
        { provide: LaddaConfig, useValue: config },
      ],
    };
  }
}
