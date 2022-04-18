import { PlanetHabitable } from './PlanetHabitable';

describe('[UNIT] - [Planets] - PlanetHabitable ValueObject', () => {
  it('should be able to save value as true, when planet is habitable', () => {
    const planetHabitable = PlanetHabitable.create({
      disposition: 'CONFIRMED',
      insolation: 0.37,
      radius: 1.5,
    });

    expect(planetHabitable.value).toBe(true);
  });

  it('should be able to return false, when planet is not confirmed', () => {
    const planetHabitable = PlanetHabitable.create({
      disposition: 'CANDIDATE',
      insolation: 0.37,
      radius: 1.5,
    });

    expect(planetHabitable.value).toBe(false);
  });

  it('should be able to return false, when insolation FLUX is less than 0.37', () => {
    const planetHabitable = PlanetHabitable.create({
      disposition: 'CONFIRMED',
      insolation: 0.36,
      radius: 1.5,
    });

    expect(planetHabitable.value).toBe(false);
  });

  it('should be able to return false, when insolation FLUX is greater than 1.11', () => {
    const planetHabitable = PlanetHabitable.create({
      disposition: 'CONFIRMED',
      insolation: 1.12,
      radius: 1.5,
    });

    expect(planetHabitable.value).toBe(false);
  });

  it('should be able to return false, when radius is greater than 1.5', () => {
    const planetHabitable = PlanetHabitable.create({
      disposition: 'CONFIRMED',
      insolation: 0.37,
      radius: 1.7,
    });

    expect(planetHabitable.value).toBe(false);
  });

  it('should be able to return false, when radius is less than 0.5', () => {
    const planetHabitable = PlanetHabitable.create({
      disposition: 'CONFIRMED',
      insolation: 0.37,
      radius: 0.4,
    });

    expect(planetHabitable.value).toBe(false);
  });
});
