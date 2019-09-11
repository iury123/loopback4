import { Entity, model, property, hasOne } from '@loopback/repository';
import { PermissionKey } from '../authorization/permission-key';
import { Armor } from './armor.model';
import { Weapon } from './weapon.model';
import { Skill } from './skill.model';

@model({ settings: {} })
export class Character extends Entity {

  @property({
    type: 'string',
    id: true,
    required: true,
  })
  email?: string;

  @property({
    type: 'string',
    required: true
  })
  password?: string;

  @property.array(String)
  permissions: PermissionKey[];

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    default: 1,
  })
  level?: number;

  @property({
    type: 'number',
    default: 100,
  })
  nextLevelExp?: number;

  @property({
    type: 'number',
    default: 0,
  })
  currentExp?: number;

  @property({
    type: 'number',
    default: 100,
  })
  maxHealth?: number;

  @property({
    type: 'number',
    default: 100,
  })
  currentHealth?: number;

  @property({
    type: 'number',
    default: 50,
  })
  maxMana?: number;

  @property({
    type: 'number',
    default: 50,
  })
  currentMana?: number;

  @property({
    type: 'number',
    default: 20,
  })
  attack?: number;

  @property({
    type: 'number',
    default: 5,
  })
  defence?: number;

  @hasOne(() => Armor)
  armor?: Armor;

  @hasOne(() => Weapon)
  weapon?: Weapon;

  @hasOne(() => Skill)
  skill?: Skill


  constructor(data?: Partial<Character>) {
    super(data);
  }
}

export interface CharacterRelations {
  // describe navigational properties here
}

export type CharacterWithRelations = Character & CharacterRelations;
