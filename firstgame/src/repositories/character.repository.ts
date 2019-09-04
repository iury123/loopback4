import { DefaultCrudRepository, HasOneRepositoryFactory, repository } from '@loopback/repository';
import { Character, CharacterRelations, Armor, Weapon, Skill } from '../models';
import { MongoDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { WeaponRepository } from './weapon.repository';
import { ArmorRepository } from './armor.repository';
import { SkillRepository } from './skill.repository';

export class CharacterRepository extends DefaultCrudRepository<
  Character,
  typeof Character.prototype.id,
  CharacterRelations
  > {

  public armor: HasOneRepositoryFactory<
    Armor, typeof Character.prototype.id>;

  public weapon: HasOneRepositoryFactory<Weapon,
    typeof Character.prototype.id>;

  public skill: HasOneRepositoryFactory<Skill,
    typeof Character.prototype.id>


  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter(WeaponRepository)
    protected weaponRepositoryGetter: Getter<WeaponRepository>,
    @repository.getter(ArmorRepository)
    protected armorRepositoryGetter: Getter<ArmorRepository>,
    @repository.getter(SkillRepository)
    protected skillRepositoryGetter: Getter<SkillRepository>
  ) {
    super(Character, dataSource);
    this.armor = this.createHasOneRepositoryFactoryFor('armor', armorRepositoryGetter);
    this.weapon = this.createHasOneRepositoryFactoryFor('weapon', weaponRepositoryGetter);
    this.skill = this.createHasOneRepositoryFactoryFor('skill', skillRepositoryGetter);
  }
}
