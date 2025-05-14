import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  profileData: any = {
    name: '',
    email: '',
    phone_number: '',
  };
  addresses: any[] = [];

  newAddress: any = {
    addressLine1: '',
    addressLine2: '',
    city: '',
    governorate: '',
  };

  editIndex: number | null = null;

  constructor(
    private profileService: ProfileService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.profileService.getProfileData().subscribe({
      next: (data) => {
        this.profileData = data.user;
        // console.log(this.profileData); // التحقق من البيانات في الـ console
      },
      error: (err) => {
        // console.error('Error loading profile data', err);
      },
    });
    //
    this.loadAddresses();
  }

  updateProfile() {
    this.profileService.updateProfileData(this.profileData).subscribe({
      next: (response) => {
        this.authService.showToast(`تم تحديث بياناتك بنجاح`, 'success');
      },
      error: (err) => {
        alert('حدث خطأ أثناء تحديث البيانات');
      },
    });
  }

  loadAddresses() {
    const stored = localStorage.getItem('userAddresses');
    this.addresses = stored ? JSON.parse(stored) : [];
  }

  saveAddresses() {
    localStorage.setItem('userAddresses', JSON.stringify(this.addresses));
  }

  addAddress() {
    // if (this.newAddress.trim()) {
    this.addresses.push({ ...this.newAddress });
    this.saveAddresses();
    this.resetForm();
    this.authService.showToast('✅ تم إضافة العنوان بنجاح');
    // }
  }

  resetForm() {
    this.newAddress = {
      addressLine1: '',
      addressLine2: '',
      city: '',
      governorate: '',
    };
  }

  editAddress(index: number) {
    this.editIndex = index;
    this.newAddress = { ...this.addresses[index] };

    // الحصول على العنصر DOM الخاص بالمودال
    const modalElement = document.getElementById('addressModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  updateAddress() {
    if (this.editIndex !== null) {
      this.addresses[this.editIndex] = { ...this.newAddress }; // نسخ العنوان المعدل
      this.saveAddresses();
      this.resetForm(); // إعادة ضبط النموذج
      this.editIndex = null;
      this.authService.showToast('✏️ تم تعديل العنوان بنجاح');
    }
  }

  deleteAddress(index: number) {
    const confirmed = confirm('هل أنت متأكد من حذف العنوان؟');
    if (confirmed) {
      this.addresses.splice(index, 1);
      this.saveAddresses();
      this.authService.showToast('🗑️ تم حذف العنوان');
    }
  }

  cancelEdit() {
    this.resetForm();
    this.editIndex = null;
  }

  saveChanges() {
    this.profileService.updateProfileData(this.profileData.user[0]).subscribe({
      next: () => {
        this.authService.showToast(`✅تم تحديث بياناتك بنجاح`, 'success');
      },
      error: (err) => {
        this.authService.showToast(` ❌ حدث خطأ أثناء التحديث' `, 'error');
        console.error(err);
      },
    });
  }
}
