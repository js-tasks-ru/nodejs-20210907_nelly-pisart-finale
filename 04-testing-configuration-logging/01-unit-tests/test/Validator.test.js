const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      const errorsToShort = validator.validate({ name: 'Lalala', age: 10 });
      const errorsToLong = validator.validate({ name: 'LalalaLalalaLalalaLalala', age: 30 });
      const errorsWrongType = validator.validate({ name: 23, age: 'lala' });

      expect(errorsToShort).to.have.length(2);
      expect(errorsToShort[0]).to.have.property('field').and.to.be.equal('name');
      expect(errorsToShort[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      expect(errorsToShort[1]).to.have.property('field').and.to.be.equal('age');
      expect(errorsToShort[1]).to.have.property('error').and.to.be.equal('too little, expect 18, got 10');

      expect(errorsToLong).to.have.length(2);
      expect(errorsToLong[0]).to.have.property('field').and.to.be.equal('name');
      expect(errorsToLong[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 24');
      expect(errorsToShort[1]).to.have.property('field').and.to.be.equal('age');
      expect(errorsToShort[1]).to.have.property('error').and.to.be.equal('too big, expect 27, got 30');

      expect(errorsWrongType).to.have.length(2);
      expect(errorsWrongType[0]).to.have.property('field').and.to.be.equal('name');
      expect(errorsWrongType[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      expect(errorsToShort[1]).to.have.property('field').and.to.be.equal('age');
      expect(errorsToShort[1]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    // it('валидатор проверяет числовые поля', () => {
    //   const validator = new Validator({
    //     age: {
    //       type: 'number',
    //       min: 18,
    //       max: 27,
    //     },
    //   });
    // });
  });
});