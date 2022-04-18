import { Stellar } from './Stellar';

describe('[UNIT] - [Stellars] - Stellar entity', () => {
  it('should be able to return an Stellar, when fields are valid', () => {
    const data = {
      mass: '5853',
      radius: 5853,
      effective_temperature: '5853',
      smet: 'smet-in-stellar-create-test',
      age: '5',
    };

    const stellar = Stellar.create(data);

    expect(stellar).toBeInstanceOf(Stellar);

    expect(stellar.id).toBeDefined();
    expect(stellar.props).toEqual(expect.objectContaining(data));
  });
});
