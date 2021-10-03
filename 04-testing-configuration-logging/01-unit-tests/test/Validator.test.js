const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля на минимальную длину', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор проверяет строковые поля на максимальную длину', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 4,
        },
      });

      const errors = validator.validate({name: 'Lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 4, got 6');
    });

    it('валидатор проверяет числовые поля на минимальное значение', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({age: 6});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 6');
    });

    it('валидатор проверяет числовые поля на максимальнуое значение', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 1,
          max: 4,
        },
      });

      const errors = validator.validate({age: 6});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 4, got 6');
    });

    it('валидатор проверяет соответствие типов полей - строка', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 10,
        },
      });

      const errors = validator.validate({name: 8});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });

    it('валидатор проверяет соответствие типов полей - число', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 1,
          max: 4,
        },
      });

      const errors = validator.validate({age: 'lalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('валидатор проверяет два поля на длину и значение', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 3,
          max: 10,
        },
        name: {
          type: 'string',
          min: 10,
          max: 40,
        },
      });

      const errors = validator.validate({age: 35, name: 'lalala'});

      expect(errors).to.have.length(2);
    });

    it('валидатор проверяет два поля на соответствие типов', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 1,
          max: 4,
        },
        name: {
          type: 'string',
          min: 3,
          max: 10,
        },
      });

      const errors = validator.validate({age: 'lalala', name: 30});

      expect(errors).to.have.length(2);
    });
  });
});
