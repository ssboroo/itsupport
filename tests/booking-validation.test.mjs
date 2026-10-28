import test from 'node:test';import assert from 'node:assert/strict';
import {validateBooking,isValidPhone,normalizePhone,SERVICE_NAMES} from '../lib/booking-validation.ts';
const valid={phone:'99112233',service:'Программ суулгах',description:'Office суулгах хэрэгтэй.',tool:'AnyDesk',consent:true};
test('all services accept nameless orders and optional time',()=>{for(const service of SERVICE_NAMES){const result=validateBooking({...valid,service});assert.equal(result.ok,true);assert.equal(result.data.time,'Боломжтой үед холбогдох');assert.ok(!('name' in result.data))}});
test('supports international formatted phone numbers',()=>{for(const phone of ['+976 9022 0101','+1 (415) 555-0123','+82 10 1234 5678'])assert.equal(isValidPhone(phone),true);assert.equal(normalizePhone('+976 9022-0101'),'+97690220101');for(const phone of ['abc','123','++97690220101','+012345678','991122334455667788'])assert.equal(isValidPhone(phone),false)});
test('rejects malformed body, fake consent and unknown service',()=>{for(const body of [null,[],{...valid,consent:'on'},{...valid,service:'unknown'},{...valid,description:'  '},{...valid,description:'x'.repeat(2001)},{...valid,tool:'bad'},{...valid,time:123}])assert.equal(validateBooking(body).ok,false)});

import {validateBusinessBooking} from '../lib/booking-validation.ts';
const business={organization:'Туршилтын оффис',phone:'99112233',email:'office@example.mn',computers:5,printers:0,issue:'Принтер тохируулах',consent:true};
test('business requests retain all quote fields in the existing order record',()=>{const r=validateBusinessBooking(business);assert.equal(r.ok,true);assert.equal(r.data.service,'Байгууллагын IT үйлчилгээ');for(const value of ['Туршилтын оффис','office@example.mn','Компьютер: 5','Принтер: 0','Принтер тохируулах'])assert.ok(r.data.description.includes(value));});
test('business validation rejects incomplete, fractional and excessive input',()=>{for(const patch of [{organization:''},{email:'wrong'},{computers:1.5},{printers:-1},{computers:'5'},{printers:10001},{issue:' '},{issue:'x'.repeat(1501)},{phone:'abc'},{consent:false}])assert.equal(validateBusinessBooking({...business,...patch}).ok,false);});
