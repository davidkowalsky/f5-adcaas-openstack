/**
 * Copyright 2019 F5 Networks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Client, expect} from '@loopback/testlab';
import {WafApplication} from '../..';
import {
  setupApplication,
  teardownApplication,
  setupEnvs,
  teardownEnvs,
  setupDepApps,
  teardownDepApps,
} from '../helpers/testsetup-helper';
import {
  givenEmptyDatabase,
  givenActionData,
  givenRuleData,
  createActionObject,
} from '../helpers/database.helpers';
import uuid = require('uuid');
import {
  ExpectedData,
  LetResponseWith,
} from '../fixtures/datasources/testrest.datasource';

describe('ActionController', () => {
  let wafapp: WafApplication;
  let client: Client;

  const prefix = '/adcaas/v1';

  before('setupApplication', async () => {
    await setupDepApps();
    ({wafapp, client} = await setupApplication());
    LetResponseWith();
    setupEnvs();
  });
  beforeEach('Empty database', async () => {
    await givenEmptyDatabase(wafapp);
  });

  after(async () => {
    await teardownApplication(wafapp);
    await teardownDepApps();
    teardownEnvs();
  });

  it('post ' + prefix + '/rules/{ruleId}/actions', async () => {
    const rule = await givenRuleData(wafapp);
    const action = createActionObject();

    const response = await client
      .post(prefix + `/rules/${rule.id}/actions`)
      .set('X-Auth-Token', ExpectedData.userToken)
      .set('tenant-id', ExpectedData.tenantId)
      .send(action)
      .expect(200);

    expect(response.body.action.id)
      .to.not.empty()
      .and.type('string');
  });

  it('get ' + prefix + '/rules/{ruleId}/actions/{actionId}', async () => {
    const rule = await givenRuleData(wafapp);
    const action = await givenActionData(wafapp, {id: uuid(), ruleId: rule.id});

    const response = await client
      .get(prefix + `/rules/${rule.id}/actions/${action.id}`)
      .set('X-Auth-Token', ExpectedData.userToken)
      .set('tenant-id', ExpectedData.tenantId)
      .expect(200);

    expect(response.body.action.id)
      .to.not.empty()
      .and.type('string');
  });

  it('get ' + prefix + '/rules/{ruleId}/actions', async () => {
    const rule = await givenRuleData(wafapp);
    await givenActionData(wafapp, {id: uuid(), ruleId: rule.id});
    await givenActionData(wafapp, {id: uuid(), ruleId: rule.id});

    const response = await client
      .get(prefix + `/rules/${rule.id}/actions`)
      .set('X-Auth-Token', ExpectedData.userToken)
      .set('tenant-id', ExpectedData.tenantId)
      .expect(200);

    expect(response.body.actions)
      .be.instanceOf(Array)
      .and.have.length(2);
  });

  it('delete ' + prefix + '/rules/{ruleId}/actions/{actionId}', async () => {
    const rule = await givenRuleData(wafapp);
    const action = await givenActionData(wafapp, {id: uuid(), ruleId: rule.id});
    await client
      .del(prefix + `/rules/${rule.id}/actions/${action.id}`)
      .set('X-Auth-Token', ExpectedData.userToken)
      .set('tenant-id', ExpectedData.tenantId)
      .expect(204);

    await client
      .get(prefix + `/rules/${rule.id}/actions/${action.id}`)
      .set('X-Auth-Token', ExpectedData.userToken)
      .set('tenant-id', ExpectedData.tenantId)
      .expect(404);
  });

  it('patch ' + prefix + '/rules/{ruleId}/actions/{actionId}', async () => {
    const rule = await givenRuleData(wafapp);
    const actionInDb = await givenActionData(wafapp, {
      id: uuid(),
      ruleId: rule.id,
    });

    const action = createActionObject({
      type: 'httpUri',
      location: 'http://1.2.2.3/index.html',
    });

    await client
      .patch(prefix + `/rules/${rule.id}/actions/${actionInDb.id}`)
      .send(action)
      .set('X-Auth-Token', ExpectedData.userToken)
      .set('tenant-id', ExpectedData.tenantId)
      .expect(204);
  });
});
