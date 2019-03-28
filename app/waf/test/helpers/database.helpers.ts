import {
  WafpolicyRepository,
  ApplicationRepository,
  TenantAssociationRepository,
  ServiceRepository,
  PoolRepository,
  MemberRepository,
  RuleRepository,
  EndpointpolicyRepository,
  ConditionRepository,
  ActionRepository,
  MonitorRepository,
} from '../../src/repositories';

import {
  Application,
  Wafpolicy,
  TenantAssociation,
  Service,
  Pool,
  Member,
  Rule,
  Endpointpolicy,
  Condition,
  Action,
  Monitor,
} from '../../src/models';
import uuid = require('uuid');
import {WafApplication} from '../../src';
import {AdcRepository} from '../../src/repositories/adc.repository';
import {Adc} from '../../src/models/adc.model';
import {isNullOrUndefined} from 'util';

export async function givenEmptyDatabase(wafapp: WafApplication) {
  const wafpolicyrepo = await wafapp.getRepository(WafpolicyRepository);
  await wafpolicyrepo.deleteAll();

  const apprepo = await wafapp.getRepository(ApplicationRepository);
  await apprepo.deleteAll();

  const adcrepo = await wafapp.getRepository(AdcRepository);
  await adcrepo.deleteAll();

  const tenantRepo = await wafapp.getRepository(TenantAssociationRepository);
  await tenantRepo.deleteAll();

  const serviceRepo = await wafapp.getRepository(ServiceRepository);
  await serviceRepo.deleteAll();

  const poolRepo = await wafapp.getRepository(PoolRepository);
  await poolRepo.deleteAll();

  const memberRepo = await wafapp.getRepository(MemberRepository);
  await memberRepo.deleteAll();

  const ruleRepo = await wafapp.getRepository(RuleRepository);
  await ruleRepo.deleteAll();

  const endpointpolicyRepo = await wafapp.getRepository(
    EndpointpolicyRepository,
  );
  await endpointpolicyRepo.deleteAll();

  const monitorRepo = await wafapp.getRepository(MonitorRepository);
  await monitorRepo.deleteAll();
}

export function createWafpolicyObject(data?: Partial<Wafpolicy>) {
  return Object.assign(
    {
      name: 'test waf policy',
      shared: false,
      tenant: ['adminz'],
      url: 'http://unknown',
      createdAt: '2019-01-21T05:03:45.502Z',
    },
    data,
  );
}

export function createEndpointpolicyObject(data?: Partial<Endpointpolicy>) {
  return Object.assign(
    {
      name: 'E1',
    },
    data,
  );
}
export function createRuleObject(data?: Partial<Rule>) {
  return Object.assign(
    {
      name: 'test',
    },
    data,
  );
}

export function createConditionObject(data?: Partial<Condition>) {
  return Object.assign(
    {
      type: 'httpUri',
      path: {operand: 'contains', values: ['/test1/']},
    },
    data,
  );
}
export function createActionObject(data?: Partial<Action>) {
  return Object.assign(
    {
      type: 'waf',
    },
    data,
  );
}
export async function givenEndpointpolicyData(
  wafapp: WafApplication,
  data?: Partial<Endpointpolicy>,
) {
  const endpointpolicyrepo = await wafapp.getRepository(
    EndpointpolicyRepository,
  );
  const obj = createEndpointpolicyObject(data);
  obj.id = uuid();

  return await endpointpolicyrepo.create(obj);
}

export async function givenRuleData(
  wafapp: WafApplication,
  data?: Partial<Rule>,
) {
  const rulerepo = await wafapp.getRepository(RuleRepository);
  const obj = createRuleObject(data);
  obj.id = uuid();
  if (isNullOrUndefined(obj.endpointpolicyId)) {
    obj.endpointpolicyId = uuid();
  }
  return await rulerepo.create(obj);
}

export async function givenConditionData(
  wafapp: WafApplication,
  data?: Partial<Condition>,
) {
  const conditionrepo = await wafapp.getRepository(ConditionRepository);
  const obj = createConditionObject(data);
  obj.id = uuid();
  return await conditionrepo.create(obj);
}

export async function givenActionData(
  wafapp: WafApplication,
  data?: Partial<Action>,
) {
  const actionrepo = await wafapp.getRepository(ActionRepository);
  const obj = createActionObject(data);
  obj.id = uuid();
  return await actionrepo.create(obj);
}

export async function givenWafpolicyData(
  wafapp: WafApplication,
  data?: Partial<Wafpolicy>,
) {
  const wafpolicyrepo = await wafapp.getRepository(WafpolicyRepository);
  const obj = createWafpolicyObject(data);
  obj.id = uuid();

  return await wafpolicyrepo.create(obj);
}

export function createApplicationObject(data?: Partial<Application>) {
  return Object.assign(
    {
      name: 'test application',
      description: 'application test data',
      status: 'Done',
      tenantId: 'TBD',
      createdAt: '2019-01-22T05:03:45.502Z',
      updatedAt: '2019-01-23T05:03:45.502Z',
    },
    data,
  );
}

export async function givenApplicationData(
  wafapp: WafApplication,
  data?: Partial<Application>,
) {
  const apprepo = await wafapp.getRepository(ApplicationRepository);
  const obj = createApplicationObject(data);
  obj.id = uuid();
  return await apprepo.create(obj);
}

export function createAdcObject(data?: Partial<Adc>) {
  return Object.assign(
    {
      name: 'adc target',
      type: 'HW',
      host: '1.2.3.4',
      port: 8443,
      username: 'admin',
      passphrase: 'admin',
    },
    data,
  );
}

export async function givenAdcData(
  wafapp: WafApplication,
  data?: Partial<Adc>,
) {
  const adcpepo = await wafapp.getRepository(AdcRepository);
  const obj = createAdcObject(data);
  return await adcpepo.create(new Adc(obj));
}

export async function givenTenantAssociationData(
  wafapp: WafApplication,
  data?: Partial<TenantAssociation>,
) {
  const repo = await wafapp.getRepository(TenantAssociationRepository);
  return await repo.create(createTenantAssociationObject(data));
}

export function createTenantAssociationObject(
  data?: Partial<TenantAssociation>,
) {
  return Object.assign(
    {
      tenantId: uuid(),
      adcId: uuid(),
      createdAt: '2019-01-22T05:03:45.502Z',
      updatedAt: '2019-01-23T05:03:45.502Z',
    },
    data,
  );
}

export async function givenServiceData(
  wafapp: WafApplication,
  appId: string,
  data?: Partial<Service>,
) {
  const appRepo = await wafapp.getRepository(ApplicationRepository);
  return await appRepo.services(appId).create(createServiceObject(data));
}

export function createServiceObject(data?: Partial<Service>) {
  return Object.assign(
    {
      virtualAddresses: ['10.0.1.11'],
    },
    data,
  );
}

export async function givenPoolData(
  wafapp: WafApplication,
  data?: Partial<Pool>,
) {
  const repo = await wafapp.getRepository(PoolRepository);
  return await repo.create(createPoolObjectWithID(data));
}

export function createPoolObjectWithID(data?: Partial<Pool>) {
  return Object.assign(
    {
      id: uuid(),
      loadBalancingMode: 'round-robin',
      monitors: ['http'],
    },
    data,
  );
}

export function createPoolObjectWithoutID(data?: Partial<Pool>) {
  return Object.assign(
    {
      loadBalancingMode: 'round-robin',
      monitors: ['http'],
    },
    data,
  );
}

export async function givenMemberData(
  wafapp: WafApplication,
  data?: Partial<Member>,
) {
  const repo = await wafapp.getRepository(MemberRepository);
  return await repo.create(createMemberObject(data));
}

export function createMemberObject(data?: Partial<Member>) {
  return Object.assign(
    {
      address: '192.0.1.23',
      port: 80,
    },
    data,
  );
}

export async function givenMonitorData(
  wafapp: WafApplication,
  data?: Partial<Monitor>,
) {
  const repo = await wafapp.getRepository(MonitorRepository);
  return await repo.create(createMonitorObject(data));
}

export function createMonitorObject(data?: Partial<Monitor>) {
  return Object.assign(
    {
      targetAddress: '192.0.1.23',
      targetPort: 80,
      monitorType: 'http',
    },
    data,
  );
}
