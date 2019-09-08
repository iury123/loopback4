import {
  Filter,
  repository
} from '@loopback/repository';
import { patch, param, requestBody, del } from '@loopback/rest';
import { Armor, Weapon, Skill, Character } from '../models';
import { WeaponRepository, ArmorRepository, SkillRepository, CharacterRepository } from '../repositories';

export class UpdateControllerController {
  constructor(
    @repository(CharacterRepository)
    public characterRepository: CharacterRepository,
    @repository(ArmorRepository)
    public armorRepository: ArmorRepository,
    @repository(WeaponRepository)
    public weaponRepository: WeaponRepository,
    @repository(SkillRepository)
    public skillRepository: SkillRepository
  ) { }

  @patch('/updatecharacter/{id}/weapon', {
    responses: {
      '200': {
        description: 'update weapon',
        content: { 'application/json': { schema: Weapon } }
      },
    },
  })
  async updateWeapon(
    @param.path.string('id') id: string,
    @requestBody() weapon: Weapon,
  ): Promise<Weapon> {

    const char: Character = await this.characterRepository.findById(id);
    char.attack! += weapon.attack;
    char.defence! += weapon.defence;

    const filter: Filter = { where: { "characterId": id } };

    const oldWeapon: Weapon = (await this.weaponRepository.find(filter))[0];

    if (oldWeapon) {
      char.attack! -= oldWeapon.attack;
      char.defence! -= oldWeapon.defence;
      await this.characterRepository.weapon(id).delete();
    }
    await this.characterRepository.updateById(id, char);
    return await this.characterRepository.weapon(id).create(weapon);
  }

  @patch('/updatecharacter/{id}/armor', {
    responses: {
      '200': {
        description: 'update armor',
        content: { 'application/json': { schema: Armor } }
      }
    }
  })
  async updateArmor(
    @param.path.string('id') id: string,
    @requestBody() armor: Armor
  ): Promise<Armor> {

    const char: Character = await this.characterRepository.findById(id);

    char.attack! += armor.attack;
    char.defence! += armor.defence;

    const filter: Filter = { where: { "characterId": id } };

    const oldArmor = (await this.armorRepository.find(filter))[0];

    if (oldArmor) {
      char.attack! -= oldArmor.attack;
      char.defence! -= oldArmor.defence;
      await this.characterRepository.armor(id).delete();
    }

    await this.characterRepository.updateById(id, char);
    return await this.characterRepository.armor(id).create(armor);
  }

  @patch('/updatecharacter/{id}/skill', {
    responses: {
      '200': {
        description: 'update skill',
        content: { 'application/json': { schema: Skill } },
      },
    },
  })
  async updateSkill(
    @param.path.string('id') id: string,
    @requestBody() skill: Skill,
  ): Promise<Skill> {
    await this.characterRepository.skill(id).delete();
    return await this.characterRepository.skill(id).create(skill);
  }

  @del('/updatecharacter/{id}/weapon', {
    responses: {
      '200': {
        description: 'DELETE Weapon'
      }
    }
  })
  async deleteWeapon(
    @param.path.string('id') id: string
  ): Promise<void> {

    const filter: Filter = { where: { "characterId": id } };
    const weapon: Weapon = (await this.weaponRepository.find(filter))[0];

    if (weapon) {
      const char: Character = await this.characterRepository.findById(id);
      char.attack! -= weapon.attack;
      char.defence! -= weapon.defence;
      await this.characterRepository.weapon(id).delete();
      await this.characterRepository.updateById(char.id, char);
    }
  }

  @del('/updatecharacter/{id}/skill', {
    responses: {
      '204': {
        description: 'DELETE Skill',
      },
    },
  })
  async deleteSkill(
    @param.path.string('id') id: string
  ): Promise<void> {
    await this.characterRepository.skill(id).delete();
  }


  @patch('/updatecharacter/{id}/levelup', {
    responses: {
      '200': {
        description: 'level up',
        content: { 'application/json': { schema: Character } },
      },
    },
  })
  async levelUp(@param.path.string('id') id: string): Promise<Character> {
    let char: Character = await this.characterRepository.findById(id);
    let levels: number = 0;
    while (char.currentExp! >= char.nextLevelExp!) {
      levels++;
      char.currentExp! -= char.nextLevelExp!;
      char.nextLevelExp! += 100;
    }
    char.level! += levels;
    char.maxHealth! += 10 * levels;
    char.currentHealth! = char.maxHealth!;
    char.maxMana! += 5 * levels;
    char.currentMana! = char.maxMana!;
    char.attack! += 3 * levels;
    char.defence! += levels;
    await this.characterRepository!.updateById(id, char);
    return char;
  }


  async findById(
    @param.path.string('id') id: string
  ): Promise<any[]> {

    const res: any[] = ['no weapon', 'no armor', 'no skill'];

    const weapon = await this.characterRepository.weapon(id).get();
    const armor = await this.characterRepository.armor(id).get();
    const skill = await this.characterRepository.skill(id).get();

    if (weapon) {
      res[0] = weapon;
    }

    if (armor) {
      res[1] = armor;
    }

    if (skill) {
      res[2] = skill;
    }
    return res;
  }

}
