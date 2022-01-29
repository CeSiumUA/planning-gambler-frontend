import { TestBed } from '@angular/core/testing';

import { RemoteHubConnectorService } from './remotehub.connector.service';

describe('Remotehub.ConnectorService', () => {
  let service: RemoteHubConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteHubConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
